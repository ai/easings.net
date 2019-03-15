import { linearInterpolation } from "./linearInterpolation";

export function mixColors(color1: string, color2: string, blend: number): string {
	if (color1.length !== 7 || color2.length !== 7) {
		return "";
	}

	const color1RGB: number[] = [];
	const color2RGB: number[] = [];
	const colorRGB: number[] = [];

	color1
		.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i)
		.forEach((item) => {
			if (item.length === 2) {
				const color = parseInt(item, 16);
				color1RGB.push(color);
			}
		});

	color2
		.match(/#*([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i)
		.forEach((item) => {
			if (item.length === 2) {
				const color = parseInt(item, 16);
				color2RGB.push(color);
			}
		});

	color1RGB
		.forEach((c1, index) => {
			const mixedColor = linearInterpolation(c1, color2RGB[index], blend);
			colorRGB.push(mixedColor);
		});

	const colorResult = colorRGB
		.map((item) => {
			let hex = item.toString(16);

			if (hex.length === 0) {
				hex = "00";
			} else if (hex.length === 1) {
				hex = `0${hex}`;
			}

			return hex;
		})
		.join("");

	return `#${colorResult}`;
}
