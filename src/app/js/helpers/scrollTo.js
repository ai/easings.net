function easingScroll(t, b, c, d) {
	// easeInOutCubic
	if ((t /= d / 2) < 1) {
		return c / 2 * t * t * t + b;
	}

	return c / 2 * ((t -= 2) * t * t + 2) + b;
}

export function scrollTo({ to, duration }) {
	const start =
		(window.pageYOffset || document.documentElement.scrollTop) -
		(document.documentElement.clientTop || 0);
	const change = to - start;
	let currentTime = 0;
	const increment = 16;

	const animateScroll = () => {
		currentTime += increment;
		window.scrollTo(0, easingScroll(currentTime, start, change, duration));

		if (currentTime < duration) {
			requestAnimationFrame(animateScroll);
		}
	};

	animateScroll();
}
