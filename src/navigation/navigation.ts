import { clearTransition, setFuncForCard } from "../card/card";
import { getTransitionTime } from "../helpers/getTransitionTime";
import { getElementPosition } from "../helpers/getElementPosition";
import { parseStringOfFourNumbers } from "../helpers/parseStringOfFourNumbers";
import { infoChartOffsetTopClassName, noTimingFunction, selectorInfo, selectorInfoChart } from "../helpers/constants";
import { setInfoFunc, setInfoName, showComplexInfo, showSimpleInfo } from "../info/info";
import overlay from "../overlay/overlay";
import { hideGradient, setGradient } from "../gradient/gradient";
import infoChart from "../info-chart/info-chart";

const selectorColumns = ".columns";
const timeTransitionForOverlay = 300;
const linkCubicBezierElement: HTMLLinkElement = document.querySelector(".js-cubic-bezier");
const linkCubicBezierHref: string = linkCubicBezierElement.href;

const header: HTMLElement = document.querySelector(".header");
const info: HTMLElement = document.querySelector(selectorInfo);
const infoChartElement: HTMLElement = document.querySelector(selectorInfoChart);
const columns: HTMLElement = document.querySelector(selectorColumns);

const overlayOffsetVertical = 30;
const overlayOffsetHorizontal = 30;

let openItemId: string|null;

info.addEventListener("click", () => {
	requestAnimationFrame(resizeInfo);
});

export function navigateMain(): void {
	window.scrollTo({
		behavior: "smooth",
		top: 0,
	});

	const item = document.getElementById(`func-${openItemId}`);
	const infoTransitionTime = getTransitionTime(info);

	openItemId = null;
	columns.removeAttribute("style");
	columns.classList.remove("columns--hide");

	info.classList.remove("info--evident");
	info.style.position = "absolute";
	info.style.top = "0px";
	info.style.left = "0px";
	info.style.right = "0px";

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

	clearTransition();

	openItemId = id;
	const name = item.getAttribute("data-name");
	const func = item.getAttribute("data-func");
	const itemOffset = item.getAttribute("data-offset");
	const transitionTimingFunction = func === noTimingFunction ? "ease" : func;

	if (name && func) {
		const infoCurve: HTMLElement = info.querySelector(".info-chart__curve");
		const itemCurve: HTMLElement = item.querySelector(".chart__curve");
		const columnsTransitionTime = getTransitionTime(columns);

		if (itemOffset === "top") {
			infoChartElement.classList.add(infoChartOffsetTopClassName);
		} else {
			infoChartElement.classList.remove(infoChartOffsetTopClassName);
		}

		setInfoName(name);
		setInfoFunc(func);
		setFuncForCard(func, name);
		infoChart.setTransitionCursor(func, name);

		if (func !== noTimingFunction) {
			const points: number[] = parseStringOfFourNumbers(func);
			linkCubicBezierElement.href = `${linkCubicBezierHref}#${points.join(",")}`;
			showSimpleInfo();
			setGradient(name, points);
		} else {
			showComplexInfo(name);
			hideGradient();
		}

		infoCurve
			.querySelector("path")
			.setAttribute("d", itemCurve.getAttribute("d"));

		info.style.transitionTimingFunction = transitionTimingFunction;
		info.style.display = "block";

		requestAnimationFrame(() => {
			const itemPosition = getElementPosition(item);

			overlay
				.show()
				.setSize({
					height: itemPosition.height,
					left: itemPosition.x,
					top: itemPosition.y,
					width: itemPosition.width,
				})
				.setTransitionDuration(timeTransitionForOverlay);

			columns.classList.add("columns--hide");

			requestAnimationFrame(() => {
				const infoPosition = getElementPosition(info);

				overlay
					.setSize({
						height: infoPosition.height + overlayOffsetVertical,
						left: infoPosition.x - overlayOffsetHorizontal / 2,
						top: infoPosition.y - overlayOffsetVertical / 2,
						width: infoPosition.width + overlayOffsetHorizontal,
					});

				const headerPosition = getElementPosition(header);
				const topOffset = headerPosition.height + headerPosition.y - overlayOffsetVertical / 2;

				requestAnimationFrame(() => {
					window.scrollTo({
						behavior: "smooth",
						top: topOffset,
					});
				});
			});
		});

		setTimeout(() => {
			info.classList.add("info--evident");
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
