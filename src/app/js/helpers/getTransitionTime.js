/**
 * Computing transition time for the element
 * @param element {Element}
 * @return {number}
 */
export function getTransitionTime(element) {
	if (!element) {
		throw "Element must not be empty";
	}

	const style = window.getComputedStyle(element);
	const transitionDurationString = /([\d.]+m*s)/i.exec(
		style.transitionDuration
	);
	const transitionDuration = Array.isArray(transitionDurationString)
		? transitionDurationString[1]
		: 0;

	const ratioTime = transitionDuration.indexOf("ms") > -1 ? 1 : 1000;

	return parseFloat(transitionDuration) * ratioTime;
}
