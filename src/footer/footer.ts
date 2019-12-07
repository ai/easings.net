import { getElement, getElementsList } from "../helpers/getElement";

const selectorFooterLang = ".footer__lang";
const selectorLangItem = `${selectorFooterLang} li`;

const footerListItems = getElementsList(
	`${selectorLangItem} a, ${selectorLangItem} span`
);
const selectElement: HTMLSelectElement = document.createElement("select");
selectElement.onchange = changeLang;

footerListItems.forEach((langLink: HTMLElement) => {
	const option: HTMLOptionElement = document.createElement("option");

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
