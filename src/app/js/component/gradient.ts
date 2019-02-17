import { color1, color2, selectorGradient } from "../helpers/constants";
import { getElement } from "../helpers/getElement";
import { mixColors } from "../helpers/mixColors";
import easings from "../helpers/easings";

const gradient: HTMLElement = getElement(selectorGradient);

export function setGradient(funcName: string, points: number[]): void {
	if (points.length !== 4 || !(funcName in easings)) {
		return;
	}

	const colors: string[] = [];

	for (let i = 0; i <= 25; i++) {
		const bland = easings[funcName](i / 25);
		const color = mixColors(color1, color2, bland);
		colors.push(`${color} ${i * 4}%`);
	}

	gradient.style.display = "block";
	gradient.style.backgroundImage = `linear-gradient(
		to bottom,
		${colors.join(", ")}
	)`;
}

export function hideGradient(): void {
	gradient.removeAttribute("style");
}
