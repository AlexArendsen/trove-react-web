import React, { useCallback } from "react";
import { useItem } from "../../hooks/UseItem";
import { useLayout } from "../../stores/useLayout";
import { ItemBlade } from "./ItemBlade/ItemBlade";

export const Sidebar = React.memo(() => {

	const layout = useLayout()
	const { item } = useItem(layout.sidebarItemId)

	const handleSidebarUp = useCallback(() => {
		if (!!item) layout.setSidebarItemId(item.parent_id || '')
	}, [item])

	if (!layout.sidebarVisible) return null

	return (
		<ItemBlade
			itemId={ layout.sidebarItemId || '' }
			onItemClick={ i => layout.setSidebarItemId(i._id) }
			onBack={ item?.isRoot ? undefined : handleSidebarUp }
			/>
	)

})