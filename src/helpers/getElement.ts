/**
 * Get DOM Element
 * @param selector {string}
 * @param context {Document|HTMLElement}
 * @return {HTMLElement}
 */
export function getElement<T extends HTMLElement = HTMLElement>(
	selector: string,
	context: Document | HTMLElement = document
): T {
	return context.querySelector(selector);
}

/**
 * Get DOM Elements
 * @param selector {string}
 * @param context {Document|HTMLElement}
 * @return {NodeList}
 */
export function getElementsList<T extends HTMLElement = HTMLElement>(
	selector: string,
	context: Document | HTMLElement = document
): NodeListOf<T> {
	return context.querySelectorAll(selector);
}
