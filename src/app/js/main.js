import { forNodeList } from "./helpers/forNodeList";
import { scrollTo } from "./helpers/scrollTo";

const listFunction = document.querySelectorAll(".js-function");
if (listFunction) {
	forNodeList(listFunction, item => {
		item.addEventListener("mouseenter", () => {
			const chart = item.querySelector(".js-function-chart");
			const offset = chart.getAttribute("data-length");

			forNodeList(listFunction, other =>
				other.classList.add("b-function--inactive")
			);

			item.classList.remove("b-function--inactive");
			item.classList.add("b-function--active");

			chart.classList.add("b-chart--active");

			item.querySelector(".js-function-dot").style.strokeDashoffset = `-${
				offset ? offset : 0
			}`;
		});

		item.addEventListener("mouseleave", () => {
			forNodeList(listFunction, other =>
				other.classList.remove("b-function--inactive")
			);

			item.classList.remove("b-function--active");

			item
				.querySelector(".js-function-chart")
				.classList.remove("b-chart--active");

			item.querySelector(".js-function-dot").style.strokeDashoffset = null;
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
