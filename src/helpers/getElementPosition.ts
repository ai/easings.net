export interface ElementPosition {
	height: number;
	width: number;
	x: number;
	y: number;
}

/**
 * Get element position
 * @param element {HTMLElement}
 * @return {{x: number, width: number, y: number, height: number}}
 */
export function getElementPosition(element: HTMLElement): ElementPosition {
	const position = element.getBoundingClientRect();

	return {
		height: position.height,
		width: position.width,
		x: position.left + window.pageXOffset,
		y: position.top + window.pageYOffset,
	};
}
