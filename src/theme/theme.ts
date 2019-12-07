import { getElementsList } from "../helpers/getElement";
import { forNodeList } from "../helpers/forNodeList";

const mql = window.matchMedia("(prefers-color-scheme: dark)");
changeTheme(mql.matches);
mql.addListener(({ matches }) => changeTheme(matches));

function changeTheme(matches: boolean): void {
	const chartList = getElementsList(".chart__curve");

	forNodeList(chartList, (item) => {
		const stroke = item.getAttribute("stroke");
		let type = "inOut";

		if (/in\)/i.test(stroke)) {
			type = "in";
		} else if (/[^n]out\)/i.test(stroke)) {
			type = "out";
		}

		if (type !== "inOut") {
			if (matches) {
				item.setAttribute(
					"stroke",
					`url(#${type === "in" ? "darkIn" : "darkOut"})`
				);
			} else {
				item.setAttribute("stroke", `url(#${type === "in" ? "in" : "out"})`);
			}
		}
	});
}
