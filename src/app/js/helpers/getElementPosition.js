/**
 * Get element position
 * @param element {Element}
 * @return {{x: number, width: number, y: number, height: number}}
 */
export function getElementPosition(element) {
	const position = element.getBoundingClientRect();

	return {
		y: position.y + window.pageYOffset,
		x: position.x + window.pageXOffset,
		width: position.width,
		height: position.height
	};
}
