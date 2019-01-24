// @flow

import { forNodeList } from "./helpers/forNodeList";

const listFunction = document.querySelectorAll(".js-function");

if (listFunction) {
	forNodeList(listFunction, item => {
		item.addEventListener("mouseenter", () => {
			forNodeList(listFunction, other =>
				other.classList.add("b-function--inactive")
			);

			item.classList.remove("b-function--inactive");

			item.classList.add("b-function--active");

			item.querySelector(".js-function-chart").classList.add("b-chart--active");
		});

		item.addEventListener("mouseleave", () => {
			forNodeList(listFunction, other =>
				other.classList.remove("b-function--inactive")
			);

			item.classList.remove("b-function--active");

			item
				.querySelector(".js-function-chart")
				.classList.remove("b-chart--active");
		});
	});
}
