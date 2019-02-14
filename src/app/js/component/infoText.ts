import { selectorInfo } from "../helpers/constants";
import { forNodeList } from "../helpers/forNodeList";

const info: HTMLElement = document.querySelector(selectorInfo);

export function setInfoName(name: string): void {
	forNodeList(
		info.querySelectorAll(".js-info-name"),
		(e) => (e.innerText = name),
	);
}

export function setInfoFunc(func: string): void {
	forNodeList(
		info.querySelectorAll(".js-info-func"),
		(e) => (e.innerText = func),
	);
}
