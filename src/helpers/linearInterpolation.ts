/**
 * Linear interpolation
 * @param y1 {number}
 * @param y2 {number}
 * @param x {number}
 * @return {number}
 */
export function linearInterpolation(y1: number, y2: number, x: number): number {
	return Math.round(x * (y2 - y1) + y1);
}
