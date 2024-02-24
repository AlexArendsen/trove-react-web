import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";
import { Routes } from "../../constants/Routes";
import { Item } from "../../redux/models/Items/Item";
import { Flex } from "../Flex/Flex";
import { FlatListItem } from "./FlatList/FlatListItem";
import { GalleryListItem } from "./GalleryList/GalleryListItem";
import { ItemSortingDropZone } from "../ItemDropZone/ItemDropZone";
import { TrText } from "../Text/Text";
import { useSortedItems } from "../../hooks/UseSortedItems";

interface ItemListProps {
	display?: 'list' | 'grouped-list' | 'gallery' | 'planner' | 'compact-list' | 'picker-list'
	items?: Item[],
	parentId?: string,
	selected?: string,
	onClick?: (item: Item) => void
	navOnClick?: boolean
}

export const ItemList = React.memo((props: ItemListProps) => {

	const history = useHistory();

	const { display, parentId, selected, onClick, navOnClick } = props

	const handleClick = useCallback((item: Item) => {
		if (onClick) onClick(item)
		else if (navOnClick) history.push(Routes.item(item._id))
	}, [ onClick ])

	const items = useSortedItems(props.items || [])

	switch (display) {

		case 'gallery': return (
			<Flex row style={{ width: '100%', flexWrap: 'wrap' }}>
				{ (items || []).map(i => (
					<GalleryListItem key={ i._id } itemId={ i._id } onClick={ () => handleClick(i) } showParent />
				)) }
			</Flex>
		)

		case 'picker-list': return (
			<Flex column style={{ width: '100%' }}>
				{ (items || []).map((i, idx) => (
					<>
						<ItemSortingDropZone dropIdx={ idx } parentId={ parentId } />
						<FlatListItem withouthCheckboxes figures='on-end' selected={ selected === i._id } key={ i._id } itemId={ i._id } onClick={ () => handleClick(i) } />
					</>
				)) }
				<ItemSortingDropZone dropIdx={ items.length } parentId={ parentId } />
			</Flex>
		)

		case 'compact-list': return (
			<Flex column style={{ width: '100%' }}>
				{ (items || []).map((i, idx) => (
					<>
						<ItemSortingDropZone dropIdx={ idx } parentId={ parentId } />
						<FlatListItem figures='on-end' selected={ selected === i._id } key={ i._id } itemId={ i._id } onClick={ () => handleClick(i) } />
					</>
				)) }
				<ItemSortingDropZone dropIdx={ items.length } parentId={ parentId } />
			</Flex>
		)

		default: return (
			<Flex column style={{ width: '100%' }}>
				{ (items || []).map((i, idx) => (
					<>
						<ItemSortingDropZone dropIdx={ idx } parentId={ parentId } />
						<FlatListItem selected={ selected === i._id } key={ i._id } itemId={ i._id } onClick={ () => handleClick(i) } />
					</>
				)) }
				<ItemSortingDropZone dropIdx={ items.length } parentId={ parentId } />
			</Flex>
		)
	}

})