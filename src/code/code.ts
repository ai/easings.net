import { forNodeList } from "../helpers/forNodeList";
import { getElementsList } from "../helpers/getElement";
import { selectorCode } from "../helpers/constants";

forNodeList(getElementsList(selectorCode), (item) => {
	item.addEventListener("click", () => {
		if (window.getSelection) {
			if (window.getSelection().isCollapsed) {
				const selection = document.createRange();
				selection.selectNode(item);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(selection);
			} else {
				window.getSelection().removeAllRanges();
			}
		}
	});
});
