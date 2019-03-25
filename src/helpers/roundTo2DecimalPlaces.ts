/**
 * Round to 2 decimal places
 * @param decimal {number}
 * @return {number}
 */
function roundTo2DecimalPlaces(decimal: number): number {
	return Math.round(decimal * 100) / 100;
}

export default roundTo2DecimalPlaces;
