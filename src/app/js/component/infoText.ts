import {
	hiddenClassName,
	selectorComplexInfo,
	selectorComplexKeyframeOpacity,
	selectorComplexKeyframeScale,
	selectorComplexKeyframeTranslate,
	selectorInfo,
	selectorSimpleInfo,
} from "../helpers/constants";
import { forNodeList } from "../helpers/forNodeList";
import { getElement, getElementsList } from "../helpers/getElement";
import { cssKeyframeHighlight } from "../helpers/cssKeyframeHighlight";

const info: HTMLElement = getElement(selectorInfo);
const infoSimple: NodeList = getElementsList(selectorSimpleInfo);
const infoComplex: NodeList = getElementsList(selectorComplexInfo);
const infoName: NodeList = getElementsList(".js-info-name", info);
const infoFuncName: NodeList = getElementsList(".js-info-func", info);

const keyframeTypes = {
	opacity: "opacity",
	scale: "scale",
	translate: "translate",
};

const infoKeyframes: any = {
	opacity: getElement(selectorComplexKeyframeOpacity),
	scale: getElement(selectorComplexKeyframeScale),
	translate: getElement(selectorComplexKeyframeTranslate),
};

export function setInfoName(name: string): void {
	forNodeList(
		infoName,
		(e) => {
			e.innerText = name;
		},
	);
}

export function setInfoFunc(func: string): void {
	forNodeList(
		infoFuncName,
		(e) => {
			e.innerText = func;
		},
	);
}

export function showSimpleInfo(): void {
	forNodeList(infoSimple, (item) => item.classList.remove(hiddenClassName));
	forNodeList(infoComplex, (item) => item.classList.add(hiddenClassName));
}

export function showComplexInfo(name: string): void {
	forNodeList(infoSimple, (item) => item.classList.add(hiddenClassName));
	forNodeList(infoComplex, (item) => item.classList.remove(hiddenClassName));

	fetch(`complex-functions/${name}.json`)
		.then((r) => r.json())
		.then((data) => {
			setTextAtInfoKeyframe(keyframeTypes.scale, data.scale);
			setTextAtInfoKeyframe(keyframeTypes.opacity, data.opacity);
			setTextAtInfoKeyframe(keyframeTypes.translate, data.translate);
		})
		.catch(() => {
			setTextAtInfoKeyframe(keyframeTypes.scale);
			setTextAtInfoKeyframe(keyframeTypes.opacity);
			setTextAtInfoKeyframe(keyframeTypes.translate);
		});
}

function setTextAtInfoKeyframe(type: string, text?: string): void {
	const element: HTMLElement = infoKeyframes[type];

	if (element) {
		if (typeof text === "string") {
			element.innerHTML = cssKeyframeHighlight(text);
		} else {
			element.innerHTML = `Ошибка загрузки!`;
		}
	}
}
