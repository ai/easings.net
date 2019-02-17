import "focus-visible/src/focus-visible";

import { forNodeList } from "./helpers/forNodeList";
import {
	navigateChart,
	navigateMain,
	resizeInfo,
} from "./component/navigation";
import { getElement, getElementsList } from "./helpers/getElement";

const classFunctionActive = "b-function--active";
const classFunctionFocus = "b-function--focus";
const classChartActive = "b-chart--active";

const selectorChart = ".js-function-chart";
const selectorCursor = ".js-function-cursor";
const cursorTransitionTime = 1500;

const listFunction = getElementsList(".js-function");
if (listFunction) {
	forNodeList(listFunction, (item, index) => {
		const chart = getElement(selectorChart, item);
		const cursor = getElement(selectorCursor, item);
		const animationName = item.getAttribute("data-name");
		const cssFunc = item.getAttribute("data-func");

		item.addEventListener("mouseenter", () => {
			forNodeList(listFunction, (other, otherIndex) => {
				if (otherIndex !== index) {
					other.classList.remove(classFunctionFocus);
					getElement(selectorChart, other).classList.remove(classChartActive);
					getElement(selectorCursor, other).style.animation = "";
				}
			});

			item.classList.add(classFunctionActive);
			chart.classList.add(classChartActive);

			if (cssFunc === "no") {
				cursor.style.animation = `${cursorTransitionTime}ms cursor-${animationName} 0.2s linear`;
			}
		});

		item.addEventListener("mouseleave", () => {
			item.classList.remove(classFunctionActive);
			chart.classList.remove(classChartActive);
			cursor.style.animation = "";
		});

		chart.addEventListener("focus", () => {
			forNodeList(listFunction, (other, otherIndex) => {
				if (otherIndex !== index) {
					other.classList.remove(classFunctionFocus);
					getElement(selectorChart, other).classList.remove(classChartActive);
					getElement(selectorCursor, other).style.animation = "";
				}
			});

			chart.classList.add(classChartActive);

			if (cssFunc === "no") {
				cursor.style.animation = `${cursorTransitionTime}ms cursor-${animationName} 0.2s linear`;
			}
		});

		chart.addEventListener("blur", () => {
			item.classList.remove(classFunctionFocus, classFunctionActive);
			chart.classList.remove(classChartActive);
			cursor.style.animation = "";
		});

		item.addEventListener("keyup", (event) => {
			if (
				event.key.toLowerCase() === "tab" ||
				event.code.toLowerCase() === "tab"
			) {
				item.classList.add(classFunctionFocus);
			}
		});

		item.addEventListener("keydown", (event) => {
			if (
				event.key.toLowerCase() === "tab" ||
				event.code.toLowerCase() === "tab"
			) {
				item.classList.remove(classFunctionFocus);
			}
		});
	});
}

const chartId = window.location.hash.slice(1);
if (chartId) {
	navigateChart(chartId);
}

const backLinks: NodeList = getElementsList(".js-back");
forNodeList(backLinks, (item) => {
	item.addEventListener("click", (event) => {
		event.preventDefault();
		navigateMain();
		history.pushState("", document.title, window.location.pathname);
	});
});

window.addEventListener("resize", resizeInfo, false);

window.addEventListener(
	"hashchange",
	() => {
		const id = window.location.hash.slice(1);

		if (id) {
			navigateChart(id);
		} else {
			navigateMain();
		}
	},
	false,
);

window.addEventListener("keydown", (event) => {
	const keyName = "escape";
	if (event.key.toLowerCase() === keyName || event.code.toLowerCase() === keyName) {
		window.location.hash = "";
	}
});
