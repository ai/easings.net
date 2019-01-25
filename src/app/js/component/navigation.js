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

	columns.style.display = null;

	requestAnimationFrame(() => {
		columns.classList.remove("b-columns--hide");
		info.classList.remove("b-info--evident");
	});

	const style = window.getComputedStyle(info);
	const transitionDurationString = /([\d.]+m*s)/i.exec(
		style.transitionDuration
	);
	const transitionDuration = Array.isArray(transitionDurationString)
		? transitionDurationString[1]
		: 0;
	const ratioTime = transitionDuration.indexOf("ms") > -1 ? 1 : 1000;
	const time = transitionDuration * ratioTime;

	setTimeout(() => {
		info.style.display = null;
	}, time);
}

export function navigateChart(id) {
	const item = document.getElementById(id);

	if (!item) {
		return;
	}

	const info = document.querySelector(".js-info");
	const infoHolderNameArray = info.querySelectorAll(".js-info-name");
	const infoHolderFunctionNameArray = info.querySelectorAll(".js-info-func");
	const columns = document.querySelector(".js-columns");

	const name = item.getAttribute("data-name");
	const func = item.getAttribute("data-func");

	if (name && func) {
		columns.classList.add("b-columns--hide");
		info.style.display = "block";

		requestAnimationFrame(() => {
			info.classList.add("b-info--evident");
		});

		const style = window.getComputedStyle(columns);
		const transitionDurationString = /([\d.]+m*s)/i.exec(
			style.transitionDuration
		);
		const transitionDuration = Array.isArray(transitionDurationString)
			? transitionDurationString[1]
			: 0;
		const ratioTime = transitionDuration.indexOf("ms") > -1 ? 1 : 1000;
		const time = transitionDuration * ratioTime;

		setTimeout(() => {
			columns.style.display = "none";
		}, time);

		forNodeList(infoHolderNameArray, e => (e.innerText = name));
		forNodeList(infoHolderFunctionNameArray, e => (e.innerText = func));

		const curve = info.querySelector(".js-info-curve");
		const svg = curve.parentElement;
		const cursor = info.querySelector(".js-info-cursor");

		cursor.style.transitionTimingFunction = func;

		const viewBox = svg.getAttribute("viewBox");
		const viewBoxPoints = /([-\d.]+)\s([-\d.]+)\s([-\d.]+)\s([-\d.]+)/.exec(
			viewBox
		);

		const chartWidth = parseFloat(viewBoxPoints[3]);
		const chartHeight = parseFloat(viewBoxPoints[4]);

		const points = /([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)/.exec(func);
		const x1 = (parseFloat(points[1]) * chartWidth).toFixed(3);
		const y1 = ((1 - parseFloat(points[2])) * chartHeight).toFixed(3);
		const x2 = (parseFloat(points[3]) * chartWidth).toFixed(3);
		const y2 = ((1 - parseFloat(points[4])) * chartHeight).toFixed(3);

		curve.setAttribute(
			"d",
			`M0 ${chartHeight}C${x1} ${y1} ${x2} ${y2} ${chartWidth} 0`
		);

		scrollTo({
			to: 0,
			duration: 500
		});

		setTimeout(() => {
			info.classList.add("b-info-chart--active");

			const cursorStyle = window.getComputedStyle(cursor);
			const transitionDurationString = /([\d.]+m*s)/i.exec(
				cursorStyle.transitionDuration
			);
			const transitionDuration = Array.isArray(transitionDurationString)
				? transitionDurationString[1]
				: 0;
			const ratioTime = transitionDuration.indexOf("ms") > -1 ? 1 : 1000;

			const transitionDelayString = /([\d.]+m*s)/i.exec(
				cursorStyle.transitionDelay
			);
			const transitionDelay = Array.isArray(transitionDelayString)
				? transitionDelayString[1]
				: 0;
			const ratioDelay = transitionDelay.indexOf("ms") > -1 ? 1 : 1000;

			const time = parseFloat(transitionDuration) * ratioTime;
			const delay = parseFloat(transitionDelay) * ratioDelay;

			setTimeout(() => {
				info.classList.remove("b-info-chart--active");
			}, time + delay + 100);
		}, 100);
	}
}
