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