import { selectorCopyButton, selectorCopyCode } from "../helpers/constants";
import { getElement, getElementsList } from "../helpers/getElement";
import { forNodeList } from "../helpers/forNodeList";
import { copyTextFromElement } from "../helpers/copyText";

const selectorIconAction = ".example-copy__icon-action";
const selectorIconDone = ".example-copy__icon-done";
const classIconHidden = "example-copy__icon-hidden";

const list = getElementsList(selectorCopyButton);

forNodeList(list, (item) => {
	item.addEventListener("click", () => {
		const code = getElement(selectorCopyCode, item.parentElement);
		copyTextFromElement(code);

		const iconAction = getElement(selectorIconAction, item);
		const iconDone = getElement(selectorIconDone, item);

		iconAction.classList.add(classIconHidden);
		iconDone.classList.remove(classIconHidden);

		setTimeout(() => {
			iconAction.classList.remove(classIconHidden);
			iconDone.classList.add(classIconHidden);
		}, 1500);
	});
});
