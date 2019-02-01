import { parseStringOfFourNumbers } from "./parseStringOfFourNumbers";

export interface IGetViewBox {
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
}

export function getViewBox(element: HTMLElement): IGetViewBox {
	const viewBox: string = element.getAttribute("viewBox");
	const viewBoxAttr: number[] = parseStringOfFourNumbers(viewBox);

	if (viewBoxAttr.length !== 4) {
		return null;
	}

	return {
		height: viewBoxAttr[3],
		width: viewBoxAttr[2],
		x: viewBoxAttr[0],
		y: viewBoxAttr[1],
	};
}
