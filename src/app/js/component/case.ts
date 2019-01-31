import { forNodeList } from "../helpers/forNodeList";
import { getViewBox } from "../helpers/getViewBox";
import { getPathCurve } from "../helpers/getPathCurve";

const casesList: NodeList = document.querySelectorAll(".js-case");

forNodeList(casesList, (itemCase) => {
	const button: HTMLElement = itemCase.querySelector(".js-case-button");
	const imageList: NodeList = itemCase.querySelectorAll(".js-case-image");

	button.addEventListener("click", () => {
		forNodeList(imageList, (item) => {
			const className: string = itemCase.getAttribute("data-class");

			item.classList.toggle(className);
		});
	});
});

export function setCases(cssFunc: string): void {
	const funcPlace: NodeList = document.querySelectorAll(".js-case-func");

	forNodeList(funcPlace, (item) => {
		const svgPlace: HTMLElement = item.querySelector(".js-case-place");
		const path: SVGElement = svgPlace.querySelector("path");
		const viewBox = getViewBox(svgPlace);
		const dCurve = getPathCurve({
			cssFunc,
			height: viewBox.height,
			width: viewBox.width,
		});

		item.style.transitionTimingFunction = cssFunc;

		path.setAttribute("d", dCurve);
	});
}
