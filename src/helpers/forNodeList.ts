/**
 * Call function for each NodeList
 */
export function forNodeList(
	elements: NodeList,
	callback: (item: HTMLElement, index: number) => void
): void {
	Array.prototype.slice.call(elements).forEach(callback);
}
