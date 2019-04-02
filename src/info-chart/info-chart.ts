import { getElement } from "../helpers/getElement";

class InfoChart {
	private readonly infoChartTargetState = getElement(".info-chart__target");
	private readonly infoChartCursor = getElement(".info-chart__cursor");
	private readonly infoChartCursorVisibleSelector = "info-chart__cursor--visible";

	private nameAnimation: string|null = null;

	constructor() {
		this.infoChartTargetState.addEventListener("pointerenter", this.showCursor);
		this.infoChartTargetState.addEventListener("pointerleave", this.hideCursor);
		this.infoChartTargetState.addEventListener("mouseenter", this.showCursor);
		this.infoChartTargetState.addEventListener("mouseleave", this.hideCursor);
		this.infoChartTargetState.addEventListener("focus", this.showCursor);
		this.infoChartTargetState.addEventListener("blur", this.hideCursor);
	}

	public setTransitionCursor(cssFunc: string, name: string): void {
		if (cssFunc === "no") {
			this.nameAnimation = name;
		} else {
			this.nameAnimation = null;
			this.infoChartCursor.style.transitionTimingFunction = cssFunc;
		}
	}

	private showCursor = (): void => {
		if (this.nameAnimation) {
			this.infoChartCursor.style.animation = `1s cursor-${this.nameAnimation} 0.2s linear`;
		}

		this.infoChartCursor.classList.add(this.infoChartCursorVisibleSelector);
	}

	private hideCursor = (): void => {
		this.infoChartCursor.style.transitionDuration = "0s";
		// tslint:disable-next-line:no-unused-expression
		void this.infoChartCursor.offsetWidth;

		if (this.nameAnimation) {
			this.infoChartCursor.style.animation = null;
		}

		this.infoChartCursor.classList.remove(this.infoChartCursorVisibleSelector);
		this.infoChartCursor.style.transitionDuration = null;
	}
}

const infoChart = new InfoChart();
export default infoChart;
