import { forNodeList } from "../helpers/forNodeList";
import { scrollTo } from "../helpers/scrollTo";
import { changePageSize, initChangePage } from "./changePageSize";
import { setFuncForCase } from "./case";
import { getViewBox } from "../helpers/getViewBox";
import { getPathCurve } from "../helpers/getPathCurve";
import { getTransitionTime } from "../helpers/getTransitionTime";
import { getElementPosition } from "../helpers/getElementPosition";

const selectorInfo = ".js-info";
const selectorColumns = ".js-columns";
const timeTransitionForOverlay = 1300;
const overlayElement: HTMLElement = document.querySelector(".js-overlay");

const info: HTMLElement = document.querySelector(selectorInfo);
const columns: HTMLElement = document.querySelector(selectorColumns);

const overlayOffsetVertical = 30;
const overlayOffsetHorizontal = 30;

let openItemId: string|null;

export function navigateMain(): void {
	scrollTo({
		duration: 500,
		to: 0,
	});

	const item = document.getElementById(`func-${openItemId}`);
	const infoTransitionTime = getTransitionTime(info);

	openItemId = null;
	columns.removeAttribute("style");
	columns.classList.remove("b-columns--hide");

	changePageSize();

	info.classList.remove("b-info--evident");
	info.style.position = "absolute";
	info.style.top = "0px";

	overlayElement.style.transitionDuration = `${timeTransitionForOverlay}ms`;

	setTimeout(() => {
		changePageSize();
		info.removeAttribute("style");

		const itemPosition = getElementPosition(item);

		overlayElement.style.width = `${itemPosition.width}px`;
		overlayElement.style.height = `${itemPosition.height}px`;
		overlayElement.style.top = `${itemPosition.y}px`;
		overlayElement.style.left = `${itemPosition.x}px`;
	}, infoTransitionTime);

	setTimeout(() => {
		overlayElement.removeAttribute("style");
	}, timeTransitionForOverlay + infoTransitionTime);
}

export function navigateChart(id: string): void {
	const item = document.getElementById(`func-${id}`);

	if (!item || openItemId === id) {
		return;
	}

	openItemId = id;
	const name = item.getAttribute("data-name");
	const func = item.getAttribute("data-func");

	if (name && func) {
		const infoChart: HTMLElement = info.querySelector(".js-info-chart");
		const infoCurve: HTMLElement = info.querySelector(".js-info-curve");
		const columnsTransitionTime = getTransitionTime(columns);

		forNodeList(
			info.querySelectorAll(".js-info-name"),
			(e) => (e.innerText = name),
		);
		forNodeList(
			info.querySelectorAll(".js-info-func"),
			(e) => (e.innerText = func),
		);

		setFuncForCase(func);
		initChangePage();

		const infoCurveViewBox = getViewBox(infoCurve);
		const dCurve = getPathCurve({
			cssFunc: func,
			height: infoCurveViewBox.height,
			width: infoCurveViewBox.width,
		});

		infoCurve
			.querySelector("path")
			.setAttribute("d", dCurve);

		info.style.transitionTimingFunction = func;
		info.style.display = "block";

		const itemPosition = getElementPosition(item);

		overlayElement.style.display = "block";
		overlayElement.style.top = `${itemPosition.y}px`;
		overlayElement.style.left = `${itemPosition.x}px`;
		overlayElement.style.width = `${itemPosition.width}px`;
		overlayElement.style.height = `${itemPosition.height}px`;
		overlayElement.style.transition = `${timeTransitionForOverlay}ms ${func}`;

		columns.classList.add("b-columns--hide");

		requestAnimationFrame(() => {
			const infoPosition = getElementPosition(info);
			const offsetX = infoPosition.x - overlayOffsetHorizontal / 2;
			const offsetY = infoPosition.y - overlayOffsetVertical / 2;

			overlayElement.style.width = `${infoPosition.width + overlayOffsetHorizontal}px`;
			overlayElement.style.height = `${infoPosition.height + overlayOffsetVertical}px`;
			overlayElement.style.top = `${offsetY}px`;
			overlayElement.style.left = `${offsetX}px`;
		});

		setTimeout(() => {
			info.classList.add("b-info--evident");
			changePageSize();
		}, timeTransitionForOverlay);

		setTimeout(() => {
			columns.style.display = "none";
		}, timeTransitionForOverlay + columnsTransitionTime);
	}
}

export function resizeInfo(): void {
	if (!openItemId) {
		return;
	}

	const infoPosition = getElementPosition(info);
	const offsetX = infoPosition.x - overlayOffsetHorizontal / 2;
	const offsetY = infoPosition.y - overlayOffsetVertical / 2;

	overlayElement.style.transitionDuration = "0s";
	overlayElement.style.height = `${infoPosition.height + overlayOffsetVertical}px`;
	overlayElement.style.width = `${infoPosition.width + overlayOffsetHorizontal}px`;
	overlayElement.style.top = `${offsetY}px`;
	overlayElement.style.left = `${offsetX}px`;
}
