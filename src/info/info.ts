import {
	selectorComplexInfo,
	selectorComplexKeyframeOpacity,
	selectorComplexKeyframeScale,
	selectorComplexKeyframeTranslate,
	selectorInfo,
	selectorSimpleInfo,
} from "../helpers/constants";
import { forNodeList } from "../helpers/forNodeList";
import { getElement, getElementsList } from "../helpers/getElement";
import { generateComplexEasings, keyframeTypes } from "../easings/easings";

const info = getElement(selectorInfo);
const infoSimple = getElementsList(selectorSimpleInfo);
const infoComplex = getElementsList(selectorComplexInfo);
const infoName = getElementsList(".js-info-name", info);
const infoFuncName = getElementsList(".js-info-func", info);

const infoKeyframes = {
	opacity: getElement(selectorComplexKeyframeOpacity),
	scale: getElement(selectorComplexKeyframeScale),
	translate: getElement(selectorComplexKeyframeTranslate),
};

export function setInfoName(name: string): void {
	forNodeList(infoName, (e) => {
		e.innerText = name;
	});
}

export function setInfoFunc(func: string): void {
	forNodeList(infoFuncName, (e) => {
		e.innerText = func;
	});
}

export function showSimpleInfo(): void {
	forNodeList(infoSimple, (item) => (item.hidden = false));
	forNodeList(infoComplex, (item) => (item.hidden = true));
}

export function showComplexInfo(name: string): void {
	forNodeList(infoSimple, (item) => (item.hidden = true));
	forNodeList(infoComplex, (item) => (item.hidden = false));

	infoKeyframes.opacity.innerHTML = generateComplexEasings(
		name,
		keyframeTypes.opacity
	);
	infoKeyframes.scale.innerHTML = generateComplexEasings(
		name,
		keyframeTypes.scale
	);
	infoKeyframes.translate.innerHTML = generateComplexEasings(
		name,
		keyframeTypes.translate
	);
}
