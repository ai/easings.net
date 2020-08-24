import { forNodeList } from "../helpers/forNodeList";
import { getTransitionTime } from "../helpers/getTransitionTime";
import { getElement, getElementsList } from "../helpers/getElement";

const cardTarget = getElement(".card__wrap[data-target=false]");
const cardTargetWithFunc = getElement(".card__wrap[data-target=true]");
const casesButtonsList = getElementsList(".cases__action");

const cardTargetClassList: { [key: string]: string } = {
	opacity: "card__wrap--opacity",
	scale: "card__wrap--scale",
	translate: "card__wrap--translate",
};

const cardClassWithoutTransition = "card__wrap--no-transition";

let isReverse = false;
let currentName: string;
let currentFunc: string;
let currentType: string;

forNodeList(casesButtonsList, (button) => {
	button.addEventListener("click", () => {
		const newType = button.getAttribute("data-type");

		setTransition(cardTarget, newType);

		if (currentName) {
			setAnimation(newType);
		} else {
			cardTargetWithFunc.style.transitionTimingFunction = currentFunc;
			setTransition(cardTargetWithFunc, newType);
		}

		currentType = newType;
	});
});

export function setFuncForCard(cssFunc: string, name: string): void {
	if (cssFunc === "no") {
		currentName = name;
	} else {
		currentName = null;
		currentFunc = cssFunc;
	}
}

export function clearTransition(): void {
	cardTarget.classList.add(cardClassWithoutTransition);
	cardTargetWithFunc.classList.add(cardClassWithoutTransition);
	cardTargetWithFunc.removeAttribute("style");

	cardTarget.classList.remove(
		cardTargetClassList.opacity,
		cardTargetClassList.scale,
		cardTargetClassList.translate
	);
	cardTargetWithFunc.classList.remove(
		cardTargetClassList.opacity,
		cardTargetClassList.scale,
		cardTargetClassList.translate
	);

	requestAnimationFrame(() => {
		cardTarget.classList.remove(cardClassWithoutTransition);
		cardTargetWithFunc.classList.remove(cardClassWithoutTransition);
	});
}

function setTransition(target: HTMLElement, newType: string): void {
	target.classList.add(cardClassWithoutTransition);

	if (newType !== currentType) {
		target.classList.remove(cardTargetClassList[currentType]);

		void target.offsetWidth;
		target.classList.remove(cardClassWithoutTransition);
		target.classList.add(cardTargetClassList[newType]);
	} else {
		void target.offsetWidth;
		target.classList.remove(cardClassWithoutTransition);
		target.classList.toggle(cardTargetClassList[newType]);
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

	void cardTargetWithFunc.offsetWidth;
	cardTargetWithFunc.style.animation = `
		${animationName} ${time}ms both ${isReverse ? "reverse" : ""} linear
	`;
}
