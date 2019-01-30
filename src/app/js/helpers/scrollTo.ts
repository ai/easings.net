function easingScroll(t: number, b: number, c: number, d: number): number {
	// easeInOutCubic
	// tslint:disable-next-line:no-conditional-assignment
	if ((t /= d / 2) < 1) {
		return c / 2 * t * t * t + b;
	}

	return c / 2 * ((t -= 2) * t * t + 2) + b;
}

export interface IScrollParams {
	duration: number;
	to: number;
}

/**
 * Scroll to the desired coordinates
 * @param to {number}
 * @param duration {number}
 */
export function scrollTo({ to, duration }: IScrollParams): void {
	const start: number =
		(window.pageYOffset || document.documentElement.scrollTop) -
		(document.documentElement.clientTop || 0);
	const change: number = to - start;
	let currentTime: number = 0;
	const increment: number = 16;

	const animateScroll: () => void = () => {
		currentTime += increment;
		window.scrollTo(0, easingScroll(currentTime, start, change, duration));

		if (currentTime < duration) {
			requestAnimationFrame(animateScroll as FrameRequestCallback);
		}
	};

	animateScroll();
}
