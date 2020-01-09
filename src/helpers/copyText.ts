export function copyTextFromElement(element: HTMLElement): void {
	const selection = document.createRange();
	selection.selectNode(element);

	window.getSelection().removeAllRanges();
	window.getSelection().addRange(selection);

	document.execCommand("copy");
	window.getSelection().removeAllRanges();
}
