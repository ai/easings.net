import { clearTransition, setFuncForCard } from "../card/card";
import { getTransitionTime } from "../helpers/getTransitionTime";
import { getElementPosition } from "../helpers/getElementPosition";
import { parseStringOfFourNumbers } from "../helpers/parseStringOfFourNumbers";
import {
	infoChartOffsetTopClassName,
	noTimingFunction,
	selectorInfo,
	selectorInfoChart,
	selectorDetails,
} from "../helpers/constants";
import { forNodeList } from "../helpers/forNodeList";
import { getElement, getElementsList } from "../helpers/getElement";
import {
	setInfoFunc,
	setInfoName,
	setInfoMaths,
	showComplexInfo,
	showSimpleInfo,
} from "../info/info";
import {
	resetOverlay,
	setSizeOverlay,
	setTransitionDurationOverlay,
	showOverlay,
} from "../overlay/overlay";
import { hideGradient, setGradient } from "../gradient/gradient";
import { setTransitionForInfoChartCursor } from "../info-chart/info-chart";

const selectorColumns = ".columns";
const timeTransitionForOverlay = 300;
const linkCubicBezierElement = getElement<HTMLLinkElement>(".js-cubic-bezier");
const linkCubicBezierHref = linkCubicBezierElement.href;

const header = getElement(".header");
const info = getElement(selectorInfo);
const infoChart = getElement(selectorInfoChart);
const columns = getElement(selectorColumns);

const overlayOffsetVertical = 30;
const overlayOffsetHorizontal = 30;

let openItemId: string | null;

window.addEventListener("resize", resizeInfo, false);

info.addEventListener("click", () => {
	requestAnimationFrame(resizeInfo);
});

const chartId = window.location.hash.slice(1);
if (chartId) {
	navigateChart(chartId);
}

window.addEventListener(
	"hashchange",
	() => {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		}
		forNodeList(getElementsList(selectorDetails), (item) => {
			if (item.hasAttribute("open")) {
				item.removeAttribute("open");
			}
		});

		const id = window.location.hash.slice(1);

		if (id) {
			navigateChart(id);
		} else {
			navigateMain();
		}
	},
	false
);

window.addEventListener("keydown", (event) => {
	const keyName = "escape";
	if (
		event.key.toLowerCase() === keyName ||
		event.code.toLowerCase() === keyName
	) {
		window.location.hash = "";
	}
});

function navigateMain(): void {
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

	setTransitionDurationOverlay(timeTransitionForOverlay);

	setTimeout(() => {
		info.removeAttribute("style");

		const itemPosition = getElementPosition(item);
		setSizeOverlay({
			height: itemPosition.height,
			left: itemPosition.x,
			top: itemPosition.y,
			width: itemPosition.width,
		});
	}, infoTransitionTime);

	setTimeout(resetOverlay, timeTransitionForOverlay + infoTransitionTime);
}

function navigateChart(id: string): void {
	const item = document.getElementById(`func-${id}`);

	if (!item || openItemId === id) {
		return;
	}

	clearTransition();

	openItemId = id;
	const name = item.getAttribute("data-name");
	const func = item.getAttribute("data-func");
	const maths = item.getAttribute("data-maths");
	const itemOffset = item.getAttribute("data-offset");
	const transitionTimingFunction = func === noTimingFunction ? "ease" : func;

	if (name && func) {
		const infoCurve = getElement(".info-chart__curve", info);
		const itemCurve = getElement(".chart__curve", item);
		const columnsTransitionTime = getTransitionTime(columns);

		if (itemOffset === "top") {
			infoChart.classList.add(infoChartOffsetTopClassName);
		} else {
			infoChart.classList.remove(infoChartOffsetTopClassName);
		}

		setInfoName(name);
		setInfoFunc(func);
		setInfoMaths(maths);
		setFuncForCard(func, name);
		setTransitionForInfoChartCursor(func, name);

		if (func !== noTimingFunction) {
			const points = parseStringOfFourNumbers(func);
			linkCubicBezierElement.href = `${linkCubicBezierHref}#${points.join(
				","
			)}`;
			showSimpleInfo();
			setGradient(name, points);
		} else {
			showComplexInfo(name);
			hideGradient();
		}

		getElement("path", infoCurve).setAttribute(
			"d",
			itemCurve.getAttribute("d")
		);

		info.style.transitionTimingFunction = transitionTimingFunction;
		info.style.display = "block";

		requestAnimationFrame(() => {
			const itemPosition = getElementPosition(item);

			setTransitionDurationOverlay(timeTransitionForOverlay);
			showOverlay();
			setSizeOverlay({
				height: itemPosition.height,
				left: itemPosition.x,
				top: itemPosition.y,
				width: itemPosition.width,
			});

			columns.classList.add("columns--hide");

			requestAnimationFrame(() => {
				const infoPosition = getElementPosition(info);

				setSizeOverlay({
					height: infoPosition.height + overlayOffsetVertical,
					left: infoPosition.x - overlayOffsetHorizontal / 2,
					top: infoPosition.y - overlayOffsetVertical / 2,
					width: infoPosition.width + overlayOffsetHorizontal,
				});

				const headerPosition = getElementPosition(header);
				const topOffset =
					headerPosition.height + headerPosition.y - overlayOffsetVertical / 2;

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

function resizeInfo(): void {
	if (!openItemId) {
		return;
	}

	const infoPosition = getElementPosition(info);

	setTransitionDurationOverlay(0);
	setSizeOverlay({
		height: infoPosition.height + overlayOffsetVertical,
		left: infoPosition.x - overlayOffsetHorizontal / 2,
		top: infoPosition.y - overlayOffsetVertical / 2,
		width: infoPosition.width + overlayOffsetHorizontal,
	});
}
