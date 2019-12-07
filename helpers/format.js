function format(dictionary, lang, langList) {
	const currentLang = lang ? lang : "en";

	const defaultDictionary = {
		lang: currentLang,
		dir: dictionary.rtl ? "rtl" : "ltr",
		authors: {
			sitnik: "Andrey Sitnik",
			solovev: "Ivan Solovev",
		},
		covenant: /(ru|uk)/i.test(currentLang) ? "и" : "and",
		short_name: "Easings.net",
	};

	const helpers = {
		link: renderLink,
		langList: langList.map((item) =>
			[
				`<li>`,
				item.code === currentLang
					? `<span>${item.name}</span>`
					: `<a href="/${item.code}" rel="alternate" hreflang="${item.code}">${item.name}</a>`,
				`</li>`,
			].join("")
		),
		redirect_script: !lang
			? renderRedirectScript(langList.map((item) => item.code))
			: "",

		service_worker:
			process.env.NODE_ENV === "production"
				? renderRegisterServiceWorker(currentLang)
				: "",
	};

	const newDictionary = Object.assign(defaultDictionary, dictionary);
	return Object.assign(formatObject(newDictionary), helpers);
}

function formatObject(dictionary) {
	const newDictionary = Object.assign({}, dictionary);

	for (let field in newDictionary) {
		if ({}.hasOwnProperty.call(newDictionary, field)) {
			if (typeof newDictionary[field] === "string") {
				newDictionary[field] = formatString(newDictionary[field]);
			} else {
				newDictionary[field] = formatObject(newDictionary[field]);
			}
		}
	}

	return newDictionary;
}

function formatString(string) {
	if (/^__format/i.test(string)) {
		const newText = string
			.replace(/^__format?\s/i, "")
			.replace(/~([^~]+)~/g, "<strong>$1</strong>")
			.replace(/\n/g, "</p><p>");

		return `<p>${newText}</p>`;
	} else if (/^__code/i.test(string)) {
		return string
			.replace(/^__code?\s/i, "")
			.replace(/`([^`]+)`/g, "<code>$1</code>");
	}

	return string;
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
							location.pathname += translations[i];
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
						.then(() =>
							navigator
								.serviceWorker.ready
								.then((worker) => worker.sync.register("syncdata")))
							.catch((error) => console.log(error)
							);
				}
		</script>
	`;
}

module.exports = format;
