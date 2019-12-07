/**
 * Get DOM Element
 * @param selector {string}
 * @param context {Document|HTMLElement}
 * @return {HTMLElement}
 */
export function getElement(
	selector: string,
	context: Document | HTMLElement = document
): HTMLElement {
	return context.querySelector(selector);
}

/**
 * Get DOM Elements
 * @param selector {string}
 * @param context {Document|HTMLElement}
 * @return {NodeList}
 */
export function getElementsList(
	selector: string,
	context: Document | HTMLElement = document
): NodeList {
	return context.querySelectorAll(selector);
}
