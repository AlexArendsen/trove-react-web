import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";
import { Routes } from "../../constants/Routes";
import { Item } from "../../redux/models/Items/Item";
import { Flex } from "../Flex/Flex";
import { FlatListItem } from "./FlatList/FlatListItem";
import { GalleryListItem } from "./GalleryList/GalleryListItem";
import { ItemSortingDropZone } from "../ItemDropZone/ItemDropZone";

interface ItemListProps {
	display?: 'list' | 'grouped-list' | 'gallery' | 'planner' | 'compact-list'
	items?: Item[],
	selected?: string,
	onClick?: (item: Item) => void
	navOnClick?: boolean
}

export const ItemList = React.memo((props: ItemListProps) => {

	const history = useHistory();

	const handleClick = useCallback((item: Item) => {
		if (props.onClick) props.onClick(item)
		else if (props.navOnClick) history.push(Routes.item(item._id))
	}, [ props.onClick ])

	const items = useMemo(() => {
		const l = props.items || []
		return l.sort((a, b) => (a.rank || 0) - (b.rank || 0))
	}, [ props.items ])

	switch (props.display) {

		case 'gallery': return (
			<Flex row style={{ width: '100%', flexWrap: 'wrap' }}>
				{ (props.items || []).map(i => (
					<GalleryListItem key={ i._id } itemId={ i._id } onClick={ () => handleClick(i) } showParent />
				)) }
			</Flex>
		)

		case 'compact-list': return (
			<Flex column style={{ width: '100%' }}>
				{ (items || []).map((i, idx) => (
					<>
						<ItemSortingDropZone dropIdx={ idx } />
						<FlatListItem figures='on-end' selected={ props.selected === i._id } key={ i._id } itemId={ i._id } onClick={ () => handleClick(i) } />
					</>
				)) }
				<ItemSortingDropZone dropIdx={ items.length } />
			</Flex>
		)

		default: return (
			<Flex column style={{ width: '100%' }}>
				{ (items || []).map((i, idx) => (
					<>
						<ItemSortingDropZone dropIdx={ idx } />
						<FlatListItem selected={ props.selected === i._id } key={ i._id } itemId={ i._id } onClick={ () => handleClick(i) } />
					</>
				)) }
				<ItemSortingDropZone dropIdx={ items.length } />
			</Flex>
		)
	}

})