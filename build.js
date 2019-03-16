const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const Parcel = require("parcel-bundler");

const PostHTML = require("posthtml");
const MQPacker = require("css-mqpacker");
const postcssCustomProperties = require("postcss-custom-properties");
const PostCSS = require("postcss");
const Terser = require("terser");

const linksElements = [
	"js-info-name",
	"js-info-func",
	"js-info-simple",
	"js-info-complex",
	"js-cubic-bezier"
];

const shortCssClassName = generateCssClassName();

const bundler = new Parcel("./src/index.pug", {
	sourceMaps: false,
	scopeHoist: true,
	publicUrl: "./"
});

async function build() {
	const bundleHome = await bundler.bundle();
	const assets = findAssets(bundleHome);

	const cssFile = assets.find(
		item => item.type === "css" && item.name.includes("/src.")
	);
	const jsFile = assets.find(
		item => item.type === "js" && item.name.includes("/src.")
	);

	let cssData = (await readFile(cssFile.name)).toString();
	let jsData = (await readFile(jsFile.name)).toString();

	await Promise.all([unlink(cssFile.name), unlink(jsFile.name)]);

	const classesList = {};

	linksElements.forEach(item => {
		classesList[item] = shortCssClassName.next().value;
	});

	function cssPlugin(root) {
		root.walkRules(rule => {
			rule.selector = rule.selector.replace(/\.[\w_-]+/g, str => {
				const kls = str.substr(1);

				if (!classesList[kls]) {
					classesList[kls] = shortCssClassName.next().value;
				}

				return "." + classesList[kls];
			});
		});
	}

	const styles = await PostCSS([
		postcssCustomProperties({
			preserve: false
		}),
		cssPlugin,
		MQPacker
	]).process(cssData, { from: cssFile.name });

	Object.keys(classesList).forEach(origin => {
		const startSelector = `["'.]`;
		const endSelector = `["'\\s\\[):,+~>]`;

		jsData = jsData.replace(
			new RegExp(`(${startSelector})${origin}(${endSelector})`, "g"),
			`$1${classesList[origin]}$2`
		);
	});

	jsData = jsData
		.replace(getJsRequireWrapper(), "(function(window,document){")
		.replace(/}\);$/, "})(window,document);");

	const minifyJS = Terser.minify(jsData, {
		toplevel: true
	});

	await writeFile(jsFile.name, minifyJS.code);

	function htmlPlugin(tree) {
		tree.match({ attrs: { class: true } }, i => ({
			tag: i.tag,
			content: i.content,
			attrs: {
				...i.attrs,
				class: i.attrs.class
					.split(" ")
					.map(origin => {
						if (!(origin in classesList)) {
							console.error(`Class "${origin}" don't use`);
							return "";
						}

						return classesList[origin];
					})
					.join(" ")
			}
		}));

		tree.match({ tag: "link", attrs: { rel: "stylesheet" } }, file => {
			if (file.attrs.href.includes("src.")) {
				return {
					tag: "style",
					content: styles.css
				};
			}

			return file;
		});
	}

	assets
		.filter(i => i.type === "html")
		.forEach(async item => {
			const html = await readFile(item.name);

			await writeFile(
				item.name,
				PostHTML()
					.use(htmlPlugin)
					.process(html, { sync: true }).html
			);
		});
}

build().catch(error => {
	process.stderr.write(error.stack + "\n");
	process.exit(1);
});

function findAssets(bundle) {
	return Array.from(bundle.childBundles).reduce(
		(all, item) => all.concat(findAssets(item)),
		[
			{
				name: bundle.name,
				type: bundle.type
			}
		]
	);
}

function* generateCssClassName() {
	const options = {
		alphabet: "abcefghijklmnopqrstuvwxyz0123456789-_",
		length: 1,
		index: 0
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

function getJsRequireWrapper() {
	return `parcelRequire=function(e){var r="av"==typeof parcelRequire&&parcelRequire,n="av"==typeof require&&require,i={};function u(e,u){if(e in i)return i[e];var t="av"==typeof parcelRequire&&parcelRequire;if(!u&&t)return t(e,!0);if(r)return r(e,!0);if(n&&"string"==typeof e)return n(e);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}return u.register=function(e,r){i[e]=r},i=e(u),u.modules=i,u}(function (require) {`;
}
