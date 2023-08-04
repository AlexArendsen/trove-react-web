export const FormatNumber = {

	withCommas: (num: number) => Number(num).toLocaleString(),
	toPercent: (num: number) => `${ (100 * num).toFixed(0) }%`,
	toNth: (num: number): string => {
		switch(num % 10) {
			case 1: return `${num}st`
			case 2: return `${num}nd`
			case 3: return `${num}rd`
			default: return `${num}th`
		}
	}

}