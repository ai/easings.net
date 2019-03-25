export interface OverlaySize {
	top: number;
	left: number;
	height: number;
	width: number;
}

class Overlay {
	private element: HTMLElement = document.querySelector(".overlay");

	constructor() {
		this.reset = this.reset.bind(this);
	}

	public setTransitionDuration(timeAtMs: number): Overlay {
		this.element.style.transitionDuration = `${timeAtMs}ms`;
		return this;
	}

	public setTransitionTimingFunction(transitionTimingFunction: string): Overlay {
		this.element.style.transitionTimingFunction = transitionTimingFunction;
		return this;
	}

	public disabledTransition(): Overlay {
		this.element.style.transitionDuration = "0s";
		return this;
	}

	public reset(): Overlay {
		this.element.removeAttribute("style");
		return this;
	}

	public show(): Overlay {
		this.element.style.display = "block";
		return this;
	}

	public setSize(size: OverlaySize): Overlay {
		this.element.style.height = `${size.height}px`;
		this.element.style.width = `${size.width}px`;
		this.element.style.top = `${size.top}px`;
		this.element.style.left = `${size.left}px`;

		return this;
	}
}

export default new Overlay();
