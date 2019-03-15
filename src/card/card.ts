import { forNodeList } from "../helpers/forNodeList";
import { getTransitionTime } from "../helpers/getTransitionTime";
import { getElement, getElementsList } from "../helpers/getElement";

const cardTarget: HTMLElement = getElement(".card__wrap:not(.card__wrap--target)");
const cardTargetWithFunc: HTMLElement = getElement(".card__wrap--target");
const casesButtonsList: NodeList = getElementsList(".cases__action");

const typeCard: {[key: string]: string} = {
	func: "",
	withoutFunc: "",
};

const cardTargetClassList: {[key: string]: string} = {
	opacity: "card__wrap--opacity",
	scale: "card__wrap--scale",
	translate: "card__wrap--translate",
};

const cardClassWithoutTransition = "card__wrap--no-transition";

let isReverse: boolean = false;
let currentName: string;

forNodeList(casesButtonsList, (button) => {
	button.addEventListener("click", () => {
		const newType: string = button.getAttribute("data-type");

		setTransition(cardTarget, newType, false);

		if (currentName) {
			setAnimation(newType);
		} else {
			setTransition(cardTargetWithFunc, newType, true);
		}
	});
});

export function setFuncForCard(cssFunc: string, name: string): void {
	clearTransition(cardTarget);
	clearTransition(cardTargetWithFunc);

	if (cssFunc === "no") {
		currentName = name;
	} else {
		cardTargetWithFunc.style.animation = "none";
		cardTargetWithFunc.style.transitionTimingFunction = cssFunc;
		currentName = null;
	}
}

function setTransition(target: HTMLElement, newType: string, isFunc: boolean): void {
	const currentType = typeCard[isFunc ? "func" : "withoutFunc"];
	const targetHasClass = target.classList.contains(cardTargetClassList[currentType]);

	const setType = (type: string) => {
		typeCard[isFunc ? "func" : "withoutFunc"] = type;
	};

	if (newType !== currentType && targetHasClass) {
		target.classList.add(cardClassWithoutTransition);
		target.classList.remove(cardTargetClassList[currentType]);

		setTimeout(() => {
			target.classList.remove(cardClassWithoutTransition);
			target.classList.add(cardTargetClassList[newType]);
			setType(newType);
		}, 100);
	} else if (newType !== currentType) {
		target.classList.add(cardTargetClassList[newType]);
		setType(newType);
	} else {
		target.classList.toggle(cardTargetClassList[newType]);
		setType(newType);
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

	typeCard.func = animationType;
	cardTargetWithFunc.style.animation = "none";
	// tslint:disable-next-line:no-unused-expression
	void cardTargetWithFunc.offsetWidth;

	requestAnimationFrame(() => {
		cardTargetWithFunc.style.animation = `
			${animationName} ${time}ms both ${isReverse ? "reverse" : ""} linear
		`;
	});
}

function clearTransition(target: HTMLElement): void {
	target.classList.add(cardClassWithoutTransition);
	target.removeAttribute("style");

	requestAnimationFrame(() => {
		target.classList.remove(
			cardTargetClassList.opacity,
			cardTargetClassList.scale,
			cardTargetClassList.translate,
		);

		requestAnimationFrame(() => {
			target.classList.remove(cardClassWithoutTransition);
		});
	});
}
