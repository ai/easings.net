import { forNodeList } from "../helpers/forNodeList";
import { getTransitionTime } from "../helpers/getTransitionTime";
import { getElement, getElementsList } from "../helpers/getElement";

const cardTarget: HTMLElement = getElement(".card__wrap[data-target=false]");
const cardTargetWithFunc: HTMLElement = getElement(".card__wrap[data-target=true]");
const casesButtonsList: NodeList = getElementsList(".cases__action");

const cardTargetClassList: {[key: string]: string} = {
	opacity: "card__wrap--opacity",
	scale: "card__wrap--scale",
	translate: "card__wrap--translate",
};

const cardClassWithoutTransition = "card__wrap--no-transition";

let isReverse: boolean = false;
let currentName: string;
let currentType: string;

forNodeList(casesButtonsList, (button) => {
	button.addEventListener("click", () => {
		const newType: string = button.getAttribute("data-type");

		setTransition(cardTarget, newType);

		if (currentName) {
			setAnimation(newType);
		} else {
			setTransition(cardTargetWithFunc, newType);
		}

		currentType = newType;
	});
});

export function setFuncForCard(cssFunc: string, name: string): void {
	clearTransition();

	if (cssFunc === "no") {
		currentName = name;
	} else {
		cardTargetWithFunc.style.animation = "none";
		cardTargetWithFunc.style.transitionTimingFunction = cssFunc;
		currentName = null;
	}
}

function setTransition(target: HTMLElement, newType: string): void {
	if (newType !== currentType) {
		target.classList.add(cardClassWithoutTransition);
		target.classList.remove(cardTargetClassList[currentType]);

		requestAnimationFrame(() => {
			target.classList.remove(cardClassWithoutTransition);
			target.classList.add(cardTargetClassList[newType]);
		});
	} else {
		target.classList.add(cardClassWithoutTransition);

		requestAnimationFrame(() => {
			target.classList.remove(cardClassWithoutTransition);
			target.classList.toggle(cardTargetClassList[newType]);
		});
	}
}

function setAnimation(animationType: string): void {
	const time = getTransitionTime(cardTargetWithFunc);
	const animationName = `${animationType}-${currentName}`;
	const styles = window.getComputedStyle(cardTargetWithFunc);

	if (styles.animationName === animationName) {
		isReverse = !isReverse;
	} else {
		isReverse = false;
	}

	cardTargetWithFunc.style.animation = "none";

	requestAnimationFrame(() => {
		cardTargetWithFunc.style.animation = `
			${animationName} ${time}ms both ${isReverse ? "reverse" : ""} linear
		`;
	});
}

export function clearTransition(): void {
	cardTarget.classList.add(cardClassWithoutTransition);
	cardTargetWithFunc.classList.add(cardClassWithoutTransition);
	cardTarget.removeAttribute("style");
	cardTargetWithFunc.removeAttribute("style");

	requestAnimationFrame(() => {
		cardTarget.classList.remove(
			cardTargetClassList.opacity,
			cardTargetClassList.scale,
			cardTargetClassList.translate,
		);
		cardTargetWithFunc.classList.remove(
			cardTargetClassList.opacity,
			cardTargetClassList.scale,
			cardTargetClassList.translate,
		);

		requestAnimationFrame(() => {
			cardTarget.classList.remove(cardClassWithoutTransition);
			cardTargetWithFunc.classList.remove(cardClassWithoutTransition);
		});
	});
}
