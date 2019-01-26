import { forNodeList } from "../helpers/forNodeList";
import { scrollTo } from "../helpers/scrollTo";
import { getTransitionTime } from "../helpers/getTransitionTime";

const selectorChartForInfo = ".js-chart-for-info";
const selectorInfo = ".js-info";
const selectorColumns = ".js-columns";
const timeTransitionChart = 400;
const additionalIndentForColumns = 50;
const additionalDiffStateInfo = 20;

export function navigateMain() {
	const item = document.querySelector(".b-function--open");
	const info = document.querySelector(selectorInfo);
	const columns = document.querySelector(selectorColumns);
	const chart = item.querySelector(selectorChartForInfo);
	const chartLink = item.querySelector(".js-function-chart");

	columns.removeAttribute("style");
	item.isExpand = false;
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
		item.classList.remove("b-function--open");
		columns.classList.remove("b-columns--hide");
	}, 200);

	setTimeout(() => {
		info.style.display = null;
		chart.removeAttribute("style");
	}, 400);
}

export function navigateChart(id) {
	const item = document.getElementById(`func-${id}`);

	if (!item || item.isExpand) {
		return;
	}

	item.isExpand = true;
	const name = item.getAttribute("data-name");
	const func = item.getAttribute("data-func");

	if (name && func) {
		const info = document.querySelector(selectorInfo);
		const infoChart = info.querySelector(".js-info-chart");
		const columns = document.querySelector(selectorColumns);
		const chart = item.querySelector(selectorChartForInfo);
		const chartLink = item.querySelector(".js-function-chart");
		const infoTimeSlide = getTransitionTime(info);
		const itemTimeSlide = getTransitionTime(item);

		forNodeList(
			info.querySelectorAll(".js-info-name"),
			e => (e.innerText = name)
		);
		forNodeList(
			info.querySelectorAll(".js-info-func"),
			e => (e.innerText = func)
		);

		info.style.transitionTimingFunction = func;
		chart.style.transitionTimingFunction = func;

		columns.classList.add("b-columns--hide");
		item.classList.add("b-function--open");

		info.style.display = "block";

		requestAnimationFrame(() => {
			const columnsPosition = columns.getBoundingClientRect();

			const position = chart.getBoundingClientRect();
			const infoChartPosition = infoChart.getBoundingClientRect();
			const holderOffset = position.height / position.width * 100;

			chart.style.position = `absolute`;
			chart.style.width = `${position.width}px`;
			infoChart.style.paddingBottom = `${holderOffset}%`;
			chartLink.style.paddingBottom = `${holderOffset}%`;

			requestAnimationFrame(() => {
				const offsetLeft = infoChartPosition.x - position.x;
				const offsetTop =
					infoChartPosition.y - position.y - additionalDiffStateInfo;

				chart.style.transitionDuration = `${timeTransitionChart}ms`;

				setTimeout(() => {
					chart.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
					chart.style.width = `${infoChartPosition.width}px`;
				}, itemTimeSlide);

				setTimeout(() => {
					info.classList.add("b-info--evident");
				}, timeTransitionChart + itemTimeSlide * 1.5);

				setTimeout(() => {
					const position = chart.getBoundingClientRect();
					const height =
						position.y -
						columnsPosition.y +
						infoChart.offsetHeight +
						additionalIndentForColumns;

					columns.style.height = `${height}px`;
					columns.style.overflow = "hidden";
				}, timeTransitionChart + itemTimeSlide + infoTimeSlide);

				setTimeout(() => {
					const position = chart.getBoundingClientRect();
					const infoChartPosition = infoChart.getBoundingClientRect();
					const diffX = infoChartPosition.x - position.x;

					chart.style.transform = `translate(${offsetLeft +
						diffX}px, ${offsetTop}px)`;
					chart.style.width = `${infoChartPosition.width}px`;
				}, timeTransitionChart + itemTimeSlide + infoTimeSlide + 100);

				scrollTo({
					to: 0,
					duration: 500
				});
			});
		});
	}
}

export function resizeChart() {
	const item = document.querySelector(".js-function.b-function--open");

	if (item) {
		const chart = item.querySelector(selectorChartForInfo);
		const chartParent = chart.parentElement;
		const info = document.querySelector(selectorInfo);
		const infoChart = info.querySelector(".js-info-chart");
		const columns = document.querySelector(selectorColumns);
		const infoPosition = info.getBoundingClientRect();
		const columnsPosition = columns.getBoundingClientRect();

		const position = chartParent.getBoundingClientRect();
		const infoChartPosition = infoChart.getBoundingClientRect();
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
