import { forNodeList } from "./helpers/forNodeList";
import {
	navigateChart,
	navigateMain,
	resizeChart,
} from "./component/navigation";

const classFunctionActive = "b-function--active";
const classFunctionFocus = "b-function--focus";
const classChartActive = "b-chart--active";

const listFunction = document.querySelectorAll(".js-function");
if (listFunction) {
	forNodeList(listFunction, (item, index) => {
		const chart = item.querySelector(".js-function-chart");

		item.addEventListener("mouseenter", () => {
			forNodeList(listFunction, (other, otherIndex) => {
				if (otherIndex !== index) {
					other.classList.remove(classFunctionFocus);
					other.querySelector(".js-function-chart").classList.remove(classChartActive);
				}
			});

			item.classList.add(classFunctionActive);
			chart.classList.add(classChartActive);
		});

		item.addEventListener("mouseleave", () => {
			item.classList.remove(classFunctionActive);
			chart.classList.remove(classChartActive);
		});

		chart.addEventListener("focus", () => {
			forNodeList(listFunction, (other, otherIndex) => {
				if (otherIndex !== index) {
					other.classList.remove(classFunctionFocus);
					other.querySelector(".js-function-chart").classList.remove(classChartActive);
				}
			});

			chart.classList.add(classChartActive);
		});

		chart.addEventListener("blur", () => {
			item.classList.remove(classFunctionFocus, classFunctionActive);
			chart.classList.remove(classChartActive);
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

window.addEventListener("resize", resizeChart);

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
