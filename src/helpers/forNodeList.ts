/**
 * Call function for each NodeList
 * @param elements {NodeList}
 * @param callback {forEachCallback}
 */
export function forNodeList(elements: NodeList, callback: (item: HTMLElement, index: number) => void): void {
	Array.prototype.slice.call(elements).forEach(callback);
}

/**
 * @callback forEachCallback
 * @param {HTMLElement} item
 * @param {number} index
 */
