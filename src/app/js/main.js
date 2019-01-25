import { forNodeList } from "./helpers/forNodeList";
import { scrollTo } from "./helpers/scrollTo";
import { navigateChart, navigateMain } from "./component/navigation";

const classFunctionActive = "b-function--active";
const classFunctionInactive = "b-function--inactive";
const classFunctionFocus = "b-function--focus";

const listFunction = document.querySelectorAll(".js-function");
if (listFunction) {
	forNodeList(listFunction, item => {
		const chart = item.querySelector(".js-function-chart");
		const link = item.querySelector("a");

		item.addEventListener("mouseenter", () => {
			const offset = chart.getAttribute("data-length");

			forNodeList(listFunction, other => {
				other.classList.add(classFunctionInactive);
				other.classList.remove(classFunctionFocus);
			});

			item.classList.remove(classFunctionInactive);
			item.classList.add(classFunctionActive);

			chart.classList.add("b-chart--active");
		});

		item.addEventListener("mouseleave", () => {
			forNodeList(listFunction, other =>
				other.classList.remove(classFunctionInactive)
			);

			item.classList.remove(classFunctionActive);

			chart.classList.remove("b-chart--active");
		});

		link.addEventListener("blur", () => {
			item.classList.remove(classFunctionFocus);
		});

		item.addEventListener("keyup", event => {
			if (
				event.key.toLowerCase() === "tab" ||
				event.code.toLowerCase() === "tab"
			) {
				item.classList.add(classFunctionFocus);
			}
		});

		item.addEventListener("keydown", event => {
			if (
				event.key.toLowerCase() === "tab" ||
				event.code.toLowerCase() === "tab"
			) {
				item.classList.remove(classFunctionFocus);
			}
		});

		link.addEventListener("click", event => {
			event.preventDefault();

			const id = link.getAttribute("href").slice(1);
			navigateChart(id);
			window.location.hash = id;
		});
	});
}

const linkMore = document.querySelector(".js-more");
if (linkMore) {
	linkMore.addEventListener("click", event => {
		event.preventDefault();

		const position = document
			.getElementById("definition")
			.getBoundingClientRect();
		scrollTo({
			to: position.top,
			duration: 200
		});
	});
}

const linkBack = document.querySelectorAll(".js-goto-main");
forNodeList(linkBack, item => {
	item.addEventListener("click", event => {
		event.preventDefault();
		navigateMain();
		window.location.hash = "";
	});
});

const chartId = window.location.hash.slice(1);
if (chartId) {
	navigateChart(chartId);
}
