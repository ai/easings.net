const bodyElement = document.body;
const rootElement = document.querySelector(".js-root");
const footerElement = document.querySelector(".js-footer");

export function initChangePage() {
	bodyElement.style.height = `${bodyElement.offsetHeight +
		footerElement.offsetHeight}px`;
}

export function changePageSize() {
	bodyElement.style.height = `${rootElement.offsetHeight +
		footerElement.offsetHeight}px`;
}

changePageSize();
window.addEventListener("resize", changePageSize);
