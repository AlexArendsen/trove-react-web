import React, { useMemo } from "react";
import { ItemList } from "../../components/ItemList/ItemList";
import { useQueryParams } from "../../hooks/UseQueryParams";
import { useStore } from "../../hooks/UseStore";

export const SearchScreen = React.memo(() => {

	const items = useStore(s => s.items.all.data || [])
	const { query } = useQueryParams();
	const results = useMemo(() => {
		if (!query) return []
		try {
			const pattern = new RegExp(query, 'i');
			return items.filter(i => pattern.test(i.title)).slice(0, 100)
		} catch {
			return []
		}
	}, [ items, query ])

	return (
		<div style={{ margin: 20 }}>
			<ItemList display='gallery' items={ results } navOnClick />
		</div>
	)

})