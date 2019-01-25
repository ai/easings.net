import { forNodeList } from "./helpers/forNodeList";
import { scrollTo } from "./helpers/scrollTo";

const classFunctionActive = "b-function--active";
const classFunctionInactive = "b-function--inactive";
const classFunctionFocus = "b-function--focus";

const listFunction = document.querySelectorAll(".js-function");
if (listFunction) {
	forNodeList(listFunction, item => {
		item.addEventListener("mouseenter", () => {
			const chart = item.querySelector(".js-function-chart");
			const offset = chart.getAttribute("data-length");

			forNodeList(listFunction, other => {
				other.classList.add(classFunctionInactive);
				other.classList.remove(classFunctionFocus);
			});

			item.classList.remove(classFunctionInactive);
			item.classList.add(classFunctionActive);

			chart.classList.add("b-chart--active");

			item.querySelector(".js-function-dot").style.strokeDashoffset = `-${
				offset ? offset : 0
			}`;
		});

		item.addEventListener("mouseleave", () => {
			forNodeList(listFunction, other =>
				other.classList.remove(classFunctionInactive)
			);

			item.classList.remove(classFunctionActive);

			item
				.querySelector(".js-function-chart")
				.classList.remove("b-chart--active");

			item.querySelector(".js-function-dot").style.strokeDashoffset = null;
		});

		item.querySelector("a").addEventListener("blur", () => {
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
