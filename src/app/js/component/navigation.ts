import { forNodeList } from "../helpers/forNodeList";
import { scrollTo } from "../helpers/scrollTo";
import { changePageSize, initChangePage } from "./changePageSize";
import { setCases } from "./case";
import { getViewBox } from "../helpers/getViewBox";
import { getPathCurve } from "../helpers/getPathCurve";
import { getTransitionTime } from "../helpers/getTransitionTime";

const selectorInfo = ".js-info";
const selectorColumns = ".js-columns";

let openItemId: string|null;

export function navigateMain(): void {
	scrollTo({
		duration: 500,
		to: 0,
	});

	const info: HTMLElement = document.querySelector(selectorInfo);
	const columns: HTMLElement = document.querySelector(selectorColumns);
	const infoTransitionTime = getTransitionTime(info);

	openItemId = null;
	columns.removeAttribute("style");
	info.classList.add("b-info--hide");
	info.classList.remove("b-info--evident");

	setTimeout(() => {
		columns.classList.remove("b-columns--hide");
	}, infoTransitionTime / 2);

	setTimeout(() => {
		info.classList.remove("b-info--hide");
		info.removeAttribute("style");
		changePageSize();
	}, infoTransitionTime);
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
		const info: HTMLElement = document.querySelector(selectorInfo);
		const infoChart: HTMLElement = info.querySelector(".js-info-chart");
		const infoCurve: HTMLElement = info.querySelector(".js-info-curve");
		const columns: HTMLElement = document.querySelector(selectorColumns);
		const columnsTransitionTime = getTransitionTime(columns);

		forNodeList(
			info.querySelectorAll(".js-info-name"),
			(e) => (e.innerText = name),
		);
		forNodeList(
			info.querySelectorAll(".js-info-func"),
			(e) => (e.innerText = func),
		);

		setCases(func);
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

		columns.classList.add("b-columns--hide");

		setTimeout(() => {
			info.classList.add("b-info--evident");
			changePageSize();
		}, 100);

		setTimeout(() => {
			columns.style.display = "none";
		}, columnsTransitionTime);
	}
}
