import isArrayLike from "lodash/isArrayLike";
import isFunc from "lodash/isFunction";

export function forNodeList(elements, callback) {
	if (elements && isArrayLike(elements) && isFunc(callback)) {
		Array.prototype.slice.call(elements).forEach(callback);
	}
}
