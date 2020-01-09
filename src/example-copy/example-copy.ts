import { selectorCopyButton, selectorCopyCode } from "../helpers/constants";
import { getElement, getElementsList } from "../helpers/getElement";
import { forNodeList } from "../helpers/forNodeList";
import { copyTextFromElement } from "../helpers/copyText";

const list = getElementsList(selectorCopyButton);

forNodeList(list, (item) => {
	item.addEventListener("click", () => {
		const code = getElement(selectorCopyCode, item.parentElement);
		copyTextFromElement(code);
	});
});
