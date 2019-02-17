export function linearInterpolation(y1: number, y2: number, x: number): number {
	return Math.round(x * (y2 - y1) + y1);
}
