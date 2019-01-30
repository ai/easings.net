import { forNodeList } from "../helpers/forNodeList";
import { scrollTo } from "../helpers/scrollTo";
import { getTransitionTime } from "../helpers/getTransitionTime";
import { getElementPosition } from "../helpers/getElementPosition";
import { changePageSize, initChangePage } from "./changePageSize";
import { setCases } from "./case";

const selectorChartForInfo = ".js-chart-for-info";
const selectorInfo = ".js-info";
const selectorColumns = ".js-columns";
const timeTransitionChart = 600;
const additionalIndentForColumns = 50;

let openItemId: string|null;
let isAbort: boolean = false;

export function navigateMain(): void {
	isAbort = true;

	const item: HTMLElement = document.querySelector(".b-function--open");
	const info: HTMLElement = document.querySelector(selectorInfo);
	const columns: HTMLElement = document.querySelector(selectorColumns);
	const chart: HTMLElement = item.querySelector(selectorChartForInfo);
	const chartLink: HTMLElement = item.querySelector(".js-function-chart");
	const infoChart: HTMLElement = info.querySelector(".js-info-chart");

	infoChart.onmouseenter = null;
	infoChart.onmouseleave = null;

	columns.removeAttribute("style");
	openItemId = null;
	chart.style.transitionDuration = `${timeTransitionChart}ms`;
	chart.style.transitionTimingFunction = item.getAttribute("data-func");
	chartLink.removeAttribute("style");

	requestAnimationFrame(() => {
		info.classList.remove("b-info--evident");

		chart.style.transform = null;
		chart.style.width = null;
		chart.style.position = null;
	});

	setTimeout(() => {
		item.classList.remove("b-function--open", "b-function--opened");
		columns.classList.remove("b-columns--hide");
	}, 200);

	setTimeout(() => {
		info.style.display = null;
		chart.removeAttribute("style");
		changePageSize();
	}, 400);
}

export function navigateChart(id: string): void {
	const item = document.getElementById(`func-${id}`);
	isAbort = false;

	if (!item || openItemId === id) {
		return;
	}

	openItemId = id;
	const name = item.getAttribute("data-name");
	const func = item.getAttribute("data-func");

	if (name && func) {
		const info: HTMLElement = document.querySelector(selectorInfo);
		const infoChart: HTMLElement = info.querySelector(".js-info-chart");
		const columns: HTMLElement = document.querySelector(selectorColumns);
		const chart: HTMLElement = item.querySelector(selectorChartForInfo);
		const chartLink: HTMLElement = item.querySelector(".js-function-chart");
		const infoTimeSlide = getTransitionTime(info);

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

		info.style.transitionTimingFunction = func;
		chart.style.transitionTimingFunction = func;

		columns.classList.add("b-columns--hide");
		item.classList.add("b-function--open");

		info.style.display = "block";
		chartLink.classList.remove("b-chart--active");

		requestAnimationFrame(() => {
			if (isAbort) {
				return;
			}

			const columnsPosition = getElementPosition(columns);
			const position = getElementPosition(chart);
			const infoChartPosition = getElementPosition(infoChart);
			const holderOffset = position.height / position.width * 100;

			chart.style.zIndex = `2`;
			chart.style.position = `absolute`;
			chart.style.width = `${position.width}px`;
			infoChart.style.paddingBottom = `${holderOffset}%`;
			chartLink.style.paddingBottom = `${holderOffset}%`;

			requestAnimationFrame(() => {
				if (isAbort) {
					return;
				}

				changePageSize();

				const offsetLeft = infoChartPosition.x - position.x;
				const offsetTop = infoChartPosition.y - position.y;

				chart.style.transitionDuration = `${timeTransitionChart}ms`;
				chart.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
				chart.style.width = `${infoChartPosition.width}px`;

				setTimeout(() => {
					if (isAbort) {
						return;
					}

					info.classList.add("b-info--evident");
				}, timeTransitionChart - 100);

				setTimeout(() => {
					if (isAbort) {
						return;
					}

					const newPosition = getElementPosition(chart);
					const height =
						newPosition.y -
						columnsPosition.y +
						infoChart.offsetHeight +
						additionalIndentForColumns;

					columns.style.height = `${height}px`;
					columns.style.overflow = "hidden";

					item.classList.add("b-function--opened");
				}, timeTransitionChart + infoTimeSlide);

				setTimeout(() => {
					if (isAbort) {
						return;
					}

					const newPosition = getElementPosition(chart);
					const newInfoChartPosition = getElementPosition(infoChart);
					const diffX = newInfoChartPosition.x - newPosition.x;

					chart.style.transform = `translate(${offsetLeft +
						diffX}px, ${offsetTop}px)`;
					chart.style.width = `${newInfoChartPosition.width}px`;

					chartLink.classList.add("b-chart--active");
					setTimeout(() => {
						chartLink.classList.remove("b-chart--active");
					}, 2100);
				}, timeTransitionChart + infoTimeSlide + 100);

				scrollTo({
					duration: 500,
					to: 0,
				});
			});
		});

		infoChart.onmouseenter = () => chartLink.classList.add("b-chart--active");
		infoChart.onmouseleave = () => chartLink.classList.remove("b-chart--active");
	}
}

export function resizeChart(): void {
	const item: HTMLElement = document.querySelector(".js-function.b-function--open");

	if (item) {
		const chart: HTMLElement = item.querySelector(selectorChartForInfo);
		const chartParent: HTMLElement = chart.parentElement;
		const info: HTMLElement = document.querySelector(selectorInfo);
		const infoChart: HTMLElement = info.querySelector(".js-info-chart");
		const columns: HTMLElement = document.querySelector(selectorColumns);
		const infoPosition = getElementPosition(info);
		const columnsPosition = getElementPosition(columns);

		const position = getElementPosition(chartParent);
		const infoChartPosition = getElementPosition(infoChart);
		const offsetLeft = infoChartPosition.x - position.x;
		const offsetTop =
			infoChartPosition.y - position.y + columnsPosition.y - infoPosition.y;
		const height =
			position.y -
			columnsPosition.y +
			infoChartPosition.height +
			additionalIndentForColumns;

		chart.style.transition = "none";
		chart.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
		chart.style.width = `${infoChartPosition.width}px`;
		columns.style.height = `${height}px`;
	}
}
