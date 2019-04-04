import { getElement, getElementsList } from "../helpers/getElement";
import { forNodeList } from "../helpers/forNodeList";

const listFunction = getElementsList(".function");

const classFunctionActive = "function--active";
const classFunctionFocus = "function--focus";
const classChartActive = "chart--active";

const selectorChart = ".function__chart";
const selectorCursor = ".chart__cursor";
const cursorTransitionTime = 1500;

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
				cursor.style.animation = `${cursorTransitionTime}ms cursor-${animationName} both 0.2s linear`;
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
				cursor.style.animation = `${cursorTransitionTime}ms cursor-${animationName} both 0.2s linear`;
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
