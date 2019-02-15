import { scrollTo } from "../helpers/scrollTo";
import { setFuncForCase } from "./case";
import { getTransitionTime } from "../helpers/getTransitionTime";
import { getElementPosition } from "../helpers/getElementPosition";
import { parseStringOfFourNumbers } from "../helpers/parseStringOfFourNumbers";
import { noTimingFunction, selectorInfo } from "../helpers/constants";
import { setInfoFunc, setInfoName, showComplexInfo, showSimpleInfo } from "./infoText";
import overlay from "./overlay";

const selectorColumns = ".js-columns";
const timeTransitionForOverlay = 300;
const linkCubicBezierElement: HTMLLinkElement = document.querySelector(".js-cubic-bezier");
const linkCubicBezierHref: string = linkCubicBezierElement.href;

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

	info.classList.remove("b-info--evident");
	info.style.position = "absolute";
	info.style.top = "0px";

	overlay.setTransitionDuration(timeTransitionForOverlay);

	setTimeout(() => {
		info.removeAttribute("style");

		const itemPosition = getElementPosition(item);

		overlay.setSize({
			height: itemPosition.height,
			left: itemPosition.x,
			top: itemPosition.y,
			width: itemPosition.width,
		});
	}, infoTransitionTime);

	setTimeout(
		overlay.reset,
		timeTransitionForOverlay + infoTransitionTime,
	);
}

export function navigateChart(id: string): void {
	const item = document.getElementById(`func-${id}`);

	if (!item || openItemId === id) {
		return;
	}

	openItemId = id;
	const name = item.getAttribute("data-name");
	const func = item.getAttribute("data-func");
	const transitionTimingFunction = func === noTimingFunction ? "ease" : func;

	if (name && func) {
		const infoCurve: HTMLElement = info.querySelector(".js-info-curve");
		const itemCurve: HTMLElement = item.querySelector(".js-function-curve");
		const columnsTransitionTime = getTransitionTime(columns);

		setInfoName(name);
		setInfoFunc(func);
		setFuncForCase(func, name);

		if (func !== noTimingFunction) {
			const points: number[] = parseStringOfFourNumbers(func);
			linkCubicBezierElement.href = `${linkCubicBezierHref}#${points.join(",")}`;
			showSimpleInfo();
		} else {
			showComplexInfo(name);
		}

		infoCurve
			.querySelector("path")
			.setAttribute("d", itemCurve.getAttribute("d"));

		info.style.transitionTimingFunction = transitionTimingFunction;
		info.style.display = "block";

		const itemPosition = getElementPosition(item);

		overlay
			.show()
			.setSize({
				height: itemPosition.height,
				left: itemPosition.x,
				top: itemPosition.y,
				width: itemPosition.width,
			})
			.setTransitionDuration(timeTransitionForOverlay)
			.setTransitionTimingFunction(transitionTimingFunction);

		columns.classList.add("b-columns--hide");

		requestAnimationFrame(() => {
			const infoPosition = getElementPosition(info);

			overlay
				.setSize({
					height: infoPosition.height + overlayOffsetVertical,
					left: infoPosition.x - overlayOffsetHorizontal / 2,
					top: infoPosition.y - overlayOffsetVertical / 2,
					width: infoPosition.width + overlayOffsetHorizontal,
				});
		});

		setTimeout(() => {
			info.classList.add("b-info--evident");

			const header: HTMLElement = document.querySelector(".js-header");
			const headerPosition = getElementPosition(header);

			scrollTo({
				duration: 300,
				to: headerPosition.height + headerPosition.y - overlayOffsetVertical / 2,
			});
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
	overlay
		.disabledTransition()
		.setSize({
			height: infoPosition.height + overlayOffsetVertical,
			left: infoPosition.x - overlayOffsetHorizontal / 2,
			top: infoPosition.y - overlayOffsetVertical / 2,
			width: infoPosition.width + overlayOffsetHorizontal,
		});
}
