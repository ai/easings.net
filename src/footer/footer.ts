import { getElement, getElementsList } from "../helpers/getElement";

const selectorFooterLang = ".footer__lang";
const selectorLangList = `${selectorFooterLang} ul`;
const selectorLangItem = `${selectorFooterLang} li`;

const footerLangList = getElement(selectorLangList);
const footerListItems = getElementsList<HTMLElement>(
	`${selectorLangItem} a, ${selectorLangItem} span`
);
const selectElement = document.createElement("select");
selectElement.onchange = changeLang;

const label = footerLangList.getAttribute("aria-label");
selectElement.setAttribute("aria-label", label);

footerListItems.forEach((langLink) => {
	const option = document.createElement("option");

	const linkHref = langLink.getAttribute("href");
	option.value = linkHref || window.location.pathname;
	option.innerText = langLink.innerText;

	if (langLink.tagName === "SPAN") {
		option.setAttribute("selected", "selected");
	}

	selectElement.appendChild(option);
});

const footerLang = getElement(selectorFooterLang);
footerLang.appendChild(selectElement);
footerLang.removeChild(getElement(`${selectorFooterLang} ul`));

function changeLang(event: any): void {
	if (/^\/easings.net/.test(window.location.pathname)) {
		window.location.pathname = `/easings.net${event.target.value}`;
	} else {
		window.location.pathname = event.target.value;
	}
}
