import "./polyfills/focus-visible";

import { forNodeList } from "./helpers/forNodeList";
import {
	navigateChart,
	navigateMain,
	resizeInfo,
} from "./navigation/navigation";
import { getElement, getElementsList } from "./helpers/getElement";
import { selectorCode } from "./helpers/constants";

const classFunctionActive = "function--active";
const classFunctionFocus = "function--focus";
const classChartActive = "chart--active";

const selectorChart = ".function__chart";
const selectorCursor = ".chart__cursor";
const cursorTransitionTime = 1500;

const listFunction = getElementsList(".function");
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

forNodeList(getElementsList(selectorCode), (item) => {
	item.addEventListener("click", () => {
		if (window.getSelection) {
			if (window.getSelection().isCollapsed) {
				const selection = document.createRange();
				selection.selectNode(item);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(selection);
			} else {
				window.getSelection().removeAllRanges();
			}
		}
	});
});

const langSelect = getElement("select") as HTMLSelectElement;
langSelect.addEventListener("change", () => {
	window.location.pathname = `/${langSelect.value}`;
});

const mql = window.matchMedia("(prefers-color-scheme: dark)");
changeTheme(mql.matches);
mql.addListener(({matches}) => changeTheme(matches));

function changeTheme(matches: boolean): void {
	const chartList = getElementsList(".chart__curve");

	forNodeList(chartList, (item) => {
		const stroke = item.getAttribute("stroke");
		let type = "inOut";

		if (/in\)/i.test(stroke)) {
			type = "in";
		} else if (/[^n]out\)/i.test(stroke)) {
			type = "out";
		}

		if (type !== "inOut") {
			if (matches) {
				item.setAttribute("stroke", `url(#${type === "in" ? "darkIn" : "darkOut"})`);
			} else {
				item.setAttribute("stroke", `url(#${type === "in" ? "in" : "out"})`);
			}
		}
	});

}
