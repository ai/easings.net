import keyframes from "./keyframes";
import easingsFunctions from "./easingsFunctions";
import roundTo2DecimalPlaces from "../helpers/roundTo2DecimalPlaces";

export const enum keyframeTypes {
	opacity = "opacity",
	scale = "scale",
	translate = "translate",
}

export function generateComplexEasings(
	name: string,
	property: keyframeTypes
): string {
	if (name in keyframes) {
		const keyframeList = keyframes[name]
			.map((item: number) => {
				const keyframeValue = easingsFunctions[name](item / 100);

				return (
					`\t<span class='u-color-brand'>${item}%</span> {\n` +
					`\t\t${getDeclaration(property, keyframeValue)}\n` +
					`\t}\n\n`
				);
			})
			.join("");

		return (
			`` +
			`<span class='u-color-brand'>@keyframes</span> <span class='u-color-second'>${property}-${name}</span> {\n` +
			keyframeList +
			`}`
		);
	}

	return "";
}

function getDeclaration(property: keyframeTypes, value: number): string {
	const roundValue = roundTo2DecimalPlaces(1 - value);

	switch (property) {
		case keyframeTypes.opacity:
			return `opacity: ${roundValue};`;

		case keyframeTypes.scale:
			return `transform: scale(${roundValue});`;

		case keyframeTypes.translate:
			return `transform: translateX(${roundTo2DecimalPlaces(-100 * value)}%);`;

		default:
			return "";
	}
}
