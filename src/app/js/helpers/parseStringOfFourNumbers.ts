export function parseStringOfFourNumbers(stringOfFourNumbers: string): number[] {
	const points: RegExpMatchArray = stringOfFourNumbers.match(/(-*[.\d]+)/g);

	if (points.length !== 4) {
		return [];
	}

	return [
		parseFloat(points[0]),
		parseFloat(points[1]),
		parseFloat(points[2]),
		parseFloat(points[3]),
	];
}
