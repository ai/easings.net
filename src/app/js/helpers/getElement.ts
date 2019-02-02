/**
 * Get DOM Element
 * @param selector {string}
 * @param context {Document|HTMLElement}
 * @return {HTMLElement}
 */
export function getElement(selector: string, context: Document|HTMLElement = document): HTMLElement {
	return context.querySelector(selector);
}
