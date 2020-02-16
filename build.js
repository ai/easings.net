const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const yamlParse = require("js-yaml");
const Mustache = require("mustache");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const copyFile = promisify(fs.copyFile);

const Parcel = require("parcel-bundler");

const PostHTML = require("posthtml");
const PostHTMLNano = require("htmlnano");
const MQPacker = require("css-mqpacker");
const PostCSS = require("postcss");
const Terser = require("terser");

const format = require("./helpers/format");
const i18nDir = path.join(__dirname, "i18n");

/**
 * @type {Lang[]}
 */
const langList = fs
	.readdirSync(i18nDir)
	.filter((filename) => !/^_/.test(filename) && /\.ya?ml$/i.test(filename))
	.map((filename) => fs.readFileSync(path.join(i18nDir, filename)))
	.map((file) => yamlParse.load(file))
	.filter((dic) => dic.version && dic.version > 1 && dic.lang_name);

const addedSelectors = [
	"js-info-name",
	"js-info-func",
	"js-info-simple",
	"js-info-complex",
	"js-cubic-bezier",
	"example-copy__icon-action",
	"footer__theme",
];

const ignoreSelectors = ["is-light", "is-dark"];

const htmlMinifyOptions = {
	mergeScripts: false,
	minifySvg: false,
};

const shortCssClassName = generateCssClassName();

const bundler = new Parcel("./src/index.pug", {
	sourceMaps: false,
	scopeHoist: true,
	publicUrl: "./",
});

const errorBundler = new Parcel("./src/404.pug", {
	sourceMaps: false,
	scopeHoist: true,
	publicUrl: "./",
});

async function build() {
	await errorBundler.bundle();

	let serviceWorkerCode = await readFile("./src/sw.js", "utf8");
	const bundleHome = await bundler.bundle();
	const bundleAssets = findAssets(bundleHome);

	const cssFile = bundleAssets.find(
		(item) => item.type === "css" && item.entryName === "index.css"
	);
	const keyframesFile = bundleAssets.find(
		(item) => item.type === "css" && item.entryName === "keyframes.css"
	);
	const jsFile = bundleAssets.find(
		(item) => item.type === "js" && item.entryName === "index.ts"
	);

	let cssData = await readFile(cssFile.name, "utf8");
	let keyframesData = await readFile(keyframesFile.name, "utf8");
	let jsData = await readFile(jsFile.name, "utf8");

	await Promise.all([
		unlink(cssFile.name),
		unlink(keyframesFile.name),
		unlink(jsFile.name),
	]);

	const classesList = {};

	ignoreSelectors.forEach((item) => {
		classesList[item] = item;
	});

	addedSelectors.forEach((item) => {
		classesList[item] = shortCssClassName.next().value;
	});

	function cssPlugin(root) {
		root.walkRules((rule) => {
			rule.selector = rule.selector.replace(/\.[\w_-]+/g, (str) => {
				const kls = str.substr(1);

				if (!classesList[kls]) {
					classesList[kls] = shortCssClassName.next().value;
				}

				return "." + classesList[kls];
			});
		});
	}

	const stylesKeyframe = await PostCSS().process(keyframesData, {
		from: keyframesFile.name,
	});

	await writeFile(keyframesFile.name, stylesKeyframe);

	await copyFile("./src/favicon.ico", "./dist/favicon.ico");

	const styles = await PostCSS([cssPlugin, MQPacker]).process(cssData, {
		from: cssFile.name,
	});

	Object.keys(classesList).forEach((origin) => {
		const startSelector = `["'.]`;
		const endSelector = `["'\\s\\[):,+~>]`;

		jsData = jsData.replace(
			new RegExp(`(${startSelector})${origin}(${endSelector})`, "g"),
			`$1${classesList[origin]}$2`
		);
	});

	jsData = jsData
		.replace(
			/parcelRequire=function.*\(function \(require\)\s?{/i,
			"(function(window,document){"
		)
		.replace(/}\);$/, "})(window,document);");

	const minifyJS = Terser.minify(jsData, {
		toplevel: true,
	});

	await writeFile(jsFile.name, minifyJS.code);

	bundleAssets.forEach((asset) => {
		serviceWorkerCode = serviceWorkerCode.replace(
			new RegExp(`['"]${asset.entryName}['"]`, "g"),
			`"/${path.basename(asset.name)}"`
		);
	});

	serviceWorkerCode = Terser.minify(serviceWorkerCode).code;

	function htmlPlugin(lang = "en") {
		return (tree) => {
			tree.match({ attrs: { class: true } }, (i) => ({
				tag: i.tag,
				content: i.content,
				attrs: {
					...i.attrs,
					class: i.attrs.class
						.split(" ")
						.map((origin) => {
							if (!(origin in classesList)) {
								console.error(`Class "${origin}" don't use`);
								return "";
							}

							return classesList[origin];
						})
						.join(" "),
				},
			}));

			tree.match({ tag: "link", attrs: { rel: "stylesheet" } }, (file) => {
				if (file.attrs.href.includes("src.")) {
					return {
						tag: "style",
						content: styles.css,
					};
				}

				return file;
			});

			tree.match({ tag: "link", attrs: { rel: "manifest" } }, (file) => ({
				tag: "link",
				attrs: {
					...file.attrs,
					href: `manifest.${lang}.json`,
				},
			}));

			tree.match({ tag: "meta", attrs: { property: "og:image" } }, (file) => ({
				tag: "meta",
				attrs: {
					...file.attrs,
					content: `https://easings.net/${file.attrs.content}`,
				},
			}));
		};
	}

	const manifest = bundleAssets.find((asset) => asset.type === "webmanifest");
	const manifestFile = await readFile(manifest.name, "utf8");

	await bundleAssets
		.filter((i) => i.type === "html")
		.map(async (item) => {
			const file = await readFile(item.name);
			const html = PostHTML([]).process(file, { sync: true }).html;

			if (/\/index\.html$/i.test(item.name)) {
				const distDirName = path.dirname(item.name);

				await langList.map(async (lang) => {
					const viewData = format(
						lang,
						lang.lang_code,
						langList.map((dic) => ({
							code: dic.lang_code,
							name: dic.lang_name,
						}))
					);

					const htmlFragment = Mustache.render(html, viewData);
					const manifestLang = Mustache.render(manifestFile, viewData);

					await writeFile(
						path.join(distDirName, `sw.${lang.lang_code}.js`),
						serviceWorkerCode.replace("/:lang", `/${lang.lang_code}`)
					);

					await writeFile(
						path.join(distDirName, `manifest.${lang.lang_code}.json`),
						manifestLang
					);

					const htmlMinFragment = await PostHTML([
						PostHTMLNano(htmlMinifyOptions),
					])
						.use(htmlPlugin(lang.lang_code))
						.process(htmlFragment);

					await writeFile(
						path.join(distDirName, `${lang.lang_code}.html`),
						htmlMinFragment.html.replace(/>\s</g, "><")
					);
				});

				const engLang = langList.find((lang) => lang.lang_code === "en");
				const htmlFragment = Mustache.render(
					html,
					format(
						engLang,
						"",
						langList.map((dic) => ({
							code: dic.lang_code,
							name: dic.lang_name,
						}))
					)
				);

				const htmlMinFragment = await PostHTML([
					PostHTMLNano(htmlMinifyOptions),
				])
					.use(htmlPlugin())
					.process(htmlFragment);

				await writeFile(item.name, htmlMinFragment.html.replace(/>\s</g, "><"));
			} else {
				await writeFile(
					item.name,
					PostHTML([])
						.use(htmlPlugin())
						.process(file, { sync: true }).html
				);
			}
		});
}

build().catch((error) => {
	process.stderr.write(error.stack + "\n");
	process.exit(1);
});

function findAssets(bundle) {
	return Array.from(bundle.childBundles).reduce(
		(all, item) => all.concat(findAssets(item)),
		[
			{
				name: bundle.name,
				entryName: bundle.entryAsset.basename,
				type: bundle.type,
			},
		]
	);
}

function* generateCssClassName() {
	const options = {
		alphabet: "abcefghijklmnopqrstuvwxyz0123456789-_",
		length: 1,
		index: 0,
	};

	const getClassName = () => {
		let result = "";

		for (let i = options.length - 1; i >= 0; i--) {
			const x = Math.pow(options.alphabet.length, i);
			const n = Math.floor(options.index / x);
			result += options.alphabet[n % options.alphabet.length];
		}

		options.index++;
		if (options.index > Math.pow(options.alphabet.length, options.length) - 1) {
			options.length++;
			options.index = 0;
		}

		return result;
	};

	while (true) {
		let result = getClassName();

		while (/^[0-9-].*$/.test(result)) {
			result = getClassName();
		}

		yield result;
	}
}

/**
 * @typedef {Object} Lang
 * @property {string} lang_code
 * @property {string} lang_name
 * @property {string} version
 */
