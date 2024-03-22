import React, { useMemo } from "react";
import { ItemList } from "../../components/ItemList/ItemList";
import { useQueryParams } from "../../hooks/UseQueryParams";
import { useStore } from "../../hooks/UseStore";
import { useItemStore } from "../../stores/ItemStore/useItemStore";
import { TrText } from "../../components/Text/Text";
import { TimeDisplay } from "../../components/TimeDisplay/TimeDisplay";

export const SearchScreen = React.memo(() => {

	const byId = useItemStore(s => s.byId)
	const items = useMemo(() => Object.values(byId), [byId])
	const { query } = useQueryParams();

	const results = useMemo(() => {
		if (!query) return []
		try {
			const pattern = new RegExp(query, 'i');
			return items
				.filter(i => pattern.test(i.title) && !!i.created_at)
				.sort((a, b) => isoCompare(a.created_at || '', b.created_at || ''))
				.slice(0, 500)
		} catch {
			return []
		}
	}, [ items, query ])

	return (
		<div style={{ margin: 20 }}>
			<ItemList display='gallery' items={ results } navOnClick noSort />
		</div>
	)

})

const isoCompare = (iso1: string, iso2: string) => {
	if (iso1 === iso2) return 0
	return iso1 > iso2 ? -1 : 1
}