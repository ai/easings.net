export function forNodeList(elements: NodeList, callback: (item: HTMLElement) => void): void {
	Array.prototype.slice.call(elements).forEach(callback);
}
