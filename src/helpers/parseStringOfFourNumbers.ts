/**
 * Parse string of four numbers (example: viewBox)
 * @param stringOfFourNumbers {string}
 * @return {number[]}
 */
export function parseStringOfFourNumbers(
	stringOfFourNumbers: string
): number[] {
	const points = stringOfFourNumbers.match(/(-*[.\d]+)/g);

	if (!points || points.length !== 4) {
		return [];
	}

	return [
		parseFloat(points[0]),
		parseFloat(points[1]),
		parseFloat(points[2]),
		parseFloat(points[3]),
	];
}
