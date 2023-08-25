export const FirstOrDefault = <TItem>(list: TItem[]) => Array.isArray(list) && list.length ? list?.[0] : undefined;
export const LastOrDefault = <TItem>(list: TItem[]) => Array.isArray(list) && list.length ? list?.[list.length - 1] : undefined;

export const GroupBy = <TItem>(list: TItem[], keySelector: (item: TItem) => string) => {
	const lookup: any = {}
	for(const i of list) {
		const k = keySelector(i)
		if (!lookup[k]) lookup[k] = []
		lookup[k].push(i)
	}
	return lookup as { [key: string]: TItem[] };
}

export const GroupByFirst = <TItem>(list: TItem[], keySelector: (item: TItem) => string) => Object.entries(GroupBy(list, keySelector))
	.reduce((lookup, next) => ({ ...lookup, [ next[0] ]: next[1][0] }), {}) as { [key: string]: TItem }

export const Unique = <TItem>(list: TItem[]): TItem[] => Array.from(new Set(list))

export const Chunk = <TItem>(list: TItem[], chunkSize: number): TItem[][] => {
	const out: TItem[][] = []
	const nChunks = Math.ceil(list.length / chunkSize)
	for(let i = 0; i < nChunks; ++i) out.push(list.slice(i * chunkSize, (i + 1) * chunkSize))
	return out
}