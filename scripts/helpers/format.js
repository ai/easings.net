const { join } = require("path");
const { readFileSync } = require("fs");
const yamlParse = require("js-yaml");

const fileDefaultDictionary = readFileSync(
	join(process.cwd(), "i18n", "en.yml")
);
const defaultDictionary = yamlParse.load(fileDefaultDictionary);

function format(dictionary, langList) {
	const helpers = {
		dir: dictionary.rtl ? "rtl" : "ltr",
		short_name: "Easings.net",

		link: renderLink,
		langList: langList.map((item) =>
			[
				`<li>`,
				item.code === dictionary.lang_code
					? `<span>${item.name}</span>`
					: `<a href="/${item.code}" rel="alternate" hreflang="${item.code}">${item.name}</a>`,
				`</li>`,
			].join("")
		),
		redirect_script: !dictionary.lang_code
			? renderRedirectScript(langList.map((item) => item.code))
			: "",

		service_worker:
			process.env.NODE_ENV === "production"
				? renderRegisterServiceWorker(dictionary.lang_code)
				: "",
	};

	const newDictionary = joinDictionary(defaultDictionary, dictionary);
	return Object.assign(formatObject(newDictionary), helpers);
}

function joinDictionary(defaultDictionary, dictionary) {
	const result = {};

	Object.keys(defaultDictionary).forEach((key) => {
		if (typeof defaultDictionary[key] !== "object") {
			result[key] =
				dictionary !== undefined && dictionary[key] !== undefined
					? dictionary[key]
					: defaultDictionary[key];
		} else {
			result[key] = joinDictionary(defaultDictionary[key], dictionary[key]);
		}
	});

	return result;
}

function formatObject(dictionary) {
	const newDictionary = Object.assign({}, dictionary);

	for (let field in newDictionary) {
		if ({}.hasOwnProperty.call(newDictionary, field)) {
			if (typeof newDictionary[field] !== "object") {
				newDictionary[field] = formatString(newDictionary[field]);
			} else {
				newDictionary[field] = formatObject(newDictionary[field]);
			}
		}
	}

	return newDictionary;
}

function formatString(source) {
	const text = source.toString().replace(/{{([^}]{2,})}}/g, "<code>$1</code>");

	if (/^__format/i.test(text)) {
		const newText = text
			.replace(/^__format?\s/i, "")
			.replace(/~~([^~]{2,})~~/g, "<strong>$1</strong>")
			.replace(/\n/g, "</p><p>");

		return `<p>${newText}</p>`;
	}

	return text;
}

function renderLink() {
	return (fragment, render) => {
		const [text, linkAttr] = fragment.match(/(\([^)]+\)|\[[^\]]+\])/g);
		const renderText = render(text.replace(/\(([^)]+)\)/, "{{$1}}"));

		return renderText
			.replace(/\((.*)\)/, "$1")
			.replace(
				/\^([^^]+)\^/,
				`<a ${linkAttr.replace(/^\[(.*)\]$/, "$1")}>$1</a>`
			);
	};
}

function renderRedirectScript(langList) {
	return `
		<script>
			(function () {
				var translations = ${JSON.stringify(langList)};

				var system = navigator.userLanguage || navigator.language;
				var dialect = system.toLowerCase();
				var language = dialect.replace(/-\\w+$/, "");

				if (language === "no") {
					language = "nb";
				} else if (language === "zh") {
					language = "zh-cn";
				}

				function find(user) {
					for (var i = 0; i < translations.length; i++) {
						if (user === translations[i]) {
							location.replace('/' + translations[i])
						}
					}
				}

				find(dialect);
				find(language);
			})();
		</script>
	`;
}

function renderRegisterServiceWorker(lang) {
	return `
		<script>
			if ("serviceWorker" in navigator) {
				navigator
					.serviceWorker
					.register("./sw.${lang}.js")
					.then(() => navigator.serviceWorker.ready)
					.then((worker) => worker.sync.register("syncdata"))
					.catch((error) => console.log(error))
			}
		</script>
	`;
}

module.exports = format;
