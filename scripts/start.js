const fs = require("fs");
const path = require("path");
const yamlParse = require("js-yaml");

const Parcel = require("parcel-bundler");
const app = require("express")();
const Mustache = require("mustache");

const format = require("./helpers/format");

const i18nDir = path.join(process.cwd(), "i18n");
const langList = fs
	.readdirSync(i18nDir)
	.filter((filename) => !/^_/.test(filename))
	.filter((filename) => /\.ya?ml$/i.test(filename))
	.map((filename) => fs.readFileSync(path.join(i18nDir, filename)))
	.map((file) => yamlParse.load(file))
	.filter((dic) => dic.version && dic.version > 1 && dic.lang_name)
	.map((dic) => ({
		code: dic.lang_code,
		name: dic.lang_name,
	}));

const bundler = new Parcel("./src/*.pug", {
	watch: true,
	hmr: true,
});

app.use("/", renderIndexPage);
app.use("/:lang", renderIndexPage);

app.use(bundler.middleware());
app.listen(1234);

function renderIndexPage(req, res, next) {
	if (
		req.originalUrl === "/" ||
		(req.params.lang && req.params.lang.match(/^[a-zA-Z]{2}$/))
	) {
		const lang = req.params.lang;

		bundler.bundle().then((data) => {
			let indexHtml = "";

			if (data.type === "html") {
				indexHtml = data.entryAsset.generated.html;
			} else {
				data.childBundles.forEach((item) => {
					if (item.entryAsset.id === "index.pug") {
						indexHtml = item.entryAsset.generated.html;
					}
				});
			}

			try {
				const langFile = fs.readFileSync(
					`./i18n/${lang ? lang : "en"}.yml`,
					"utf8"
				);
				const viewData = yamlParse.load(langFile);

				if (viewData.version >= 2) {
					res.send(Mustache.render(indexHtml, format(viewData, langList)));
				} else {
					res.writeHead(406);
					res.end("The translation must be at least the 2nd version!");
				}
			} catch (e) {
				console.log(e);
				res.writeHead(404);
				res.end("The translation does not exist!");
			}
		});
	} else {
		next();
	}
}
