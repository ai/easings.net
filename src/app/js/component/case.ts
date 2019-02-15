import { forNodeList } from "../helpers/forNodeList";
import { getTransitionTime } from "../helpers/getTransitionTime";
import { getElement, getElementsList } from "../helpers/getElement";

const caseTarget: HTMLElement = getElement(".js-case-target");
const caseTargetWithFunc: HTMLElement = getElement(".js-case-func");
const caseButtonsList: NodeList = getElementsList(".js-case-button");

const typeCase: {[key: string]: string} = {
	func: "",
	withoutFunc: "",
};

const caseTargetClassList: {[key: string]: string} = {
	opacity: "b-card__wrap--opacity",
	scale: "b-card__wrap--scale",
	translate: "b-card__wrap--translate",
};

const caseClassWithoutTransition = "b-card__wrap--no-transition";

let isReverse: boolean = false;
let currentName: string;

forNodeList(caseButtonsList, (button) => {
	button.addEventListener("click", () => {
		const newType: string = button.getAttribute("data-type");

		setTransition(caseTarget, newType, false);

		if (currentName) {
			setAnimation(newType);
		} else {
			setTransition(caseTargetWithFunc, newType, true);
		}
	});
});

export function setFuncForCase(cssFunc: string, name: string): void {
	clearTransition(caseTarget);
	clearTransition(caseTargetWithFunc);

	if (cssFunc === "no") {
		currentName = name;
	} else {
		caseTargetWithFunc.style.animation = "none";
		caseTargetWithFunc.style.transitionTimingFunction = cssFunc;
		currentName = null;
	}
}

function setTransition(target: HTMLElement, newType: string, isFunc: boolean): void {
	const currentType = typeCase[isFunc ? "func" : "withoutFunc"];
	const targetHasClass = target.classList.contains(caseTargetClassList[currentType]);

	const setType = (type: string) => {
		typeCase[isFunc ? "func" : "withoutFunc"] = type;
	};

	if (newType !== currentType && targetHasClass) {
		target.classList.add(caseClassWithoutTransition);
		target.classList.remove(caseTargetClassList[currentType]);

		setTimeout(() => {
			target.classList.remove(caseClassWithoutTransition);
			target.classList.add(caseTargetClassList[newType]);
			setType(newType);
		}, 100);
	} else if (newType !== currentType) {
		target.classList.add(caseTargetClassList[newType]);
		setType(newType);
	} else {
		target.classList.toggle(caseTargetClassList[newType]);
		setType(newType);
	}
}

function setAnimation(animationType: string): void {
	const time = getTransitionTime(caseTargetWithFunc);
	const animationName = `${animationType}-${currentName}`;
	const styles = window.getComputedStyle(caseTargetWithFunc);

	if (styles.animationName === animationName) {
		isReverse = !isReverse;
	} else {
		isReverse = false;
	}

	typeCase.func = animationType;
	caseTargetWithFunc.style.animation = "none";
	// tslint:disable-next-line:no-unused-expression
	void caseTargetWithFunc.offsetWidth;

	requestAnimationFrame(() => {
		caseTargetWithFunc.style.animation = `
			${animationName} ${time}ms both ${isReverse ? "reverse" : ""}
		`;
	});
}

function clearTransition(target: HTMLElement): void {
	target.classList.add(caseClassWithoutTransition);
	target.removeAttribute("style");

	requestAnimationFrame(() => {
		target.classList.remove(
			caseTargetClassList.opacity,
			caseTargetClassList.scale,
			caseTargetClassList.translate,
		);

		requestAnimationFrame(() => {
			target.classList.remove(caseClassWithoutTransition);
		});
	});
}
