import { forNodeList } from "../helpers/forNodeList";

const caseTargetList: NodeList = document.querySelectorAll(".js-case-target");
const caseTargetWithFunc: HTMLElement = document.querySelector(".js-case-func");
const caseButtonsList: NodeList = document.querySelectorAll(".js-case-button");

const caseTargetClassList: {[key: string]: string} = {
	opacity: "b-card__wrap--opacity",
	scale: "b-card__wrap--scale",
	translate: "b-card__wrap--translate",
};

const caseClassWithoutTransition = "b-card__wrap--no-transition";

let currentType: string;

forNodeList(caseButtonsList, (button) => {
	button.addEventListener("click", () => {
		const newType: string = button.getAttribute("data-type");

		forNodeList(caseTargetList, (target) => {
			const targetHasClass = target.classList.contains(caseTargetClassList[currentType]);

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
		});
	});
});

function setType(newType: string): void {
	currentType = newType;
}

export function setFuncForCase(cssFunc: string): void {
	forNodeList(caseTargetList, (target) => {
		target.classList.add(caseClassWithoutTransition);
		target.classList.remove(
			caseTargetClassList.opacity,
			caseTargetClassList.scale,
			caseTargetClassList.translate,
		);

		requestAnimationFrame(() => {
			target.classList.remove(caseClassWithoutTransition);
		});
	});

	caseTargetWithFunc.style.transitionTimingFunction = cssFunc;
}
