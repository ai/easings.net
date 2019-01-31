export interface IParamsGetPathCurve {
	readonly cssFunc: string;
	readonly width: number;
	readonly height: number;
}

export function getPathCurve(params: IParamsGetPathCurve): string {
	const points: RegExpMatchArray = params.cssFunc.match(/(-*[.\d]+)/g);
	const x1: string = (parseFloat(points[0]) * params.width).toFixed(3);
	const y1: string = ((1 - parseFloat(points[1])) * params.height).toFixed(3);
	const x2: string = (parseFloat(points[2]) * params.width).toFixed(3);
	const y2: string = ((1 - parseFloat(points[3])) * params.height).toFixed(3);

	return `M0 ${params.height}C${x1} ${y1} ${x2} ${y2} ${params.width} 0`;
}
