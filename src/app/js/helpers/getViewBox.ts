export interface IGetViewBox {
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
}

export function getViewBox(element: HTMLElement): IGetViewBox {
	const viewBox: string = element.getAttribute("viewBox");
	const viewBoxAttr: RegExpMatchArray = viewBox.match(/([-.\d]+)/g);

	if (!viewBoxAttr) {
		return null;
	}

	return {
		height: parseFloat(viewBoxAttr[3]),
		width: parseFloat(viewBoxAttr[2]),
		x: parseFloat(viewBoxAttr[0]),
		y: parseFloat(viewBoxAttr[1]),
	};
}
