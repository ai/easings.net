export interface IParamsGetPathCurve {
	readonly points: number[];
	readonly width: number;
	readonly height: number;
}

export function getPathCurve(params: IParamsGetPathCurve): string {
	if (params.points.length !== 4) {
		return;
	}

	const x1: string = (params.points[0] * params.width).toFixed(3);
	const y1: string = ((1 - params.points[1]) * params.height).toFixed(3);
	const x2: string = (params.points[2] * params.width).toFixed(3);
	const y2: string = ((1 - params.points[3]) * params.height).toFixed(3);

	return `M0 ${params.height}C${x1} ${y1} ${x2} ${y2} ${params.width} 0`;
}
