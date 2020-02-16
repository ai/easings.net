import { getElement } from "../helpers/getElement";

const infoChartTargetState = getElement(".info-chart__target");
const infoChartCursor = getElement(".info-chart__cursor");
const infoChartCursorVisibleSelector = "info-chart__cursor--visible";

let nameAnimation: string | null = null;

infoChartTargetState.addEventListener("pointerenter", showCursor);
infoChartTargetState.addEventListener("pointerleave", hideCursor);
infoChartTargetState.addEventListener("mouseenter", showCursor);
infoChartTargetState.addEventListener("mouseleave", hideCursor);
infoChartTargetState.addEventListener("focus", showCursor);
infoChartTargetState.addEventListener("blur", hideCursor);

export function setTransitionForInfoChartCursor(
	cssFunc: string,
	name: string
): void {
	if (cssFunc === "no") {
		nameAnimation = name;
	} else {
		nameAnimation = null;
		infoChartCursor.style.transitionTimingFunction = cssFunc;
	}
}

function showCursor(): void {
	if (nameAnimation) {
		infoChartCursor.style.animation = `
				1s cursor-${nameAnimation} both 0.2s linear
			`;
	}

	infoChartCursor.classList.add(infoChartCursorVisibleSelector);
}

function hideCursor(): void {
	infoChartCursor.style.transitionDuration = "0s";
	// tslint:disable-next-line:no-unused-expression
	void infoChartCursor.offsetWidth;

	if (nameAnimation) {
		infoChartCursor.style.animation = null;
	}

	infoChartCursor.classList.remove(infoChartCursorVisibleSelector);
	infoChartCursor.style.transitionDuration = null;
}
