/**
 * Computing transition time for the element
 * @param element {Element}
 * @return {number}
 */
export function getTransitionTime(element: Element): number {
	const style = window.getComputedStyle(element);
	const transitionDurationString = /([\d.]+m*s)/i.exec(
		style.transitionDuration
	);

	const transitionDuration = parseFloat(transitionDurationString[1]);
	const ratioTime = transitionDurationString[1].indexOf("ms") > -1 ? 1 : 1000;

	return transitionDuration * ratioTime;
}
