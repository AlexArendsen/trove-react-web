export const FormatNumber = {

	withCommas: (num: number) => Number(num).toLocaleString(),
	toPercent: (num: number) => `${ (100 * num).toFixed(0) }%`

}