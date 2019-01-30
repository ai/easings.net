const bodyElement: HTMLElement = document.body;
const rootElement: HTMLElement = document.querySelector(".js-root");
const footerElement: HTMLElement = document.querySelector(".js-footer");

export function initChangePage(): void {
	bodyElement.style.height = `${bodyElement.offsetHeight +
		footerElement.offsetHeight}px`;
}

export function changePageSize(): void {
	bodyElement.style.height = `${rootElement.offsetHeight +
		footerElement.offsetHeight}px`;
}

changePageSize();
window.addEventListener("resize", changePageSize);
