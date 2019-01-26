import { forNodeList } from "../helpers/forNodeList";
import { scrollTo } from "../helpers/scrollTo";

export function navigate(id) {
	if (id !== "") {
		navigateChart(id);
	} else {
		navigateMain();
	}
}

export function navigateMain() {
	const info = document.querySelector(".js-info");
	const columns = document.querySelector(".js-columns");
	const chart = document.querySelector(".b-function--open .js-function-chart");

	columns.style.display = null;

	requestAnimationFrame(() => {
		info.classList.remove("b-info--evident");

		chart.style.position = null;
		chart.style.transform = null;
		chart.style.width = null;
	});

	setTimeout(() => {
		document
			.querySelector(".b-function--open")
			.classList.remove("b-function--open");
		columns.classList.remove("b-columns--hide");
	}, 200);

	setTimeout(() => {
		info.style.display = null;
		chart.removeAttribute("style");
	}, 400);

	// const style = window.getComputedStyle(info);
	// const transitionDurationString = /([\d.]+m*s)/i.exec(
	// 	style.transitionDuration
	// );
	// const transitionDuration = Array.isArray(transitionDurationString)
	// 	? transitionDurationString[1]
	// 	: 0;
	// const ratioTime = transitionDuration.indexOf("ms") > -1 ? 1 : 1000;
	// const time = transitionDuration * ratioTime;
	//
	// setTimeout(() => {
	// 	info.style.display = null;
	// }, time);
}

export function navigateChart(id) {
	const item = document.getElementById(id);

	if (!item) {
		return;
	}

	const info = document.querySelector(".js-info");
	const infoChart = info.querySelector(".js-info-chart");
	const infoHolderNameArray = info.querySelectorAll(".js-info-name");
	const infoHolderFunctionNameArray = info.querySelectorAll(".js-info-func");
	const columns = document.querySelector(".js-columns");

	const name = item.getAttribute("data-name");
	const func = item.getAttribute("data-func");

	if (name && func) {
		columns.classList.add("b-columns--hide");
		item.classList.add("b-function--open");

		forNodeList(infoHolderNameArray, e => (e.innerText = name));
		forNodeList(infoHolderFunctionNameArray, e => (e.innerText = func));

		info.style.display = "block";

		const chart = item.querySelector(".js-function-chart");
		const position = chart.getBoundingClientRect();
		const infoChartPosition = infoChart.getBoundingClientRect();

		chart.style.width = `${position.width}px`;

		const offsetLeft = infoChartPosition.x - position.x;
		const offsetTop = infoChartPosition.y - position.y;
		const timeTransition = 400;

		chart.style.transition = `${timeTransition}ms`;

		setTimeout(() => {
			chart.style.position = "absolute";
			chart.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
			chart.style.width = `${infoChartPosition.width}px`;
		}, 200);

		setTimeout(() => {
			info.classList.add("b-info--evident");
		}, timeTransition + 300);

		scrollTo({
			to: 0,
			duration: 500
		});
	}
}
