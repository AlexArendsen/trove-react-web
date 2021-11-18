import React, { useCallback } from "react";
import { useHistory } from "react-router";
import { Routes } from "../../constants/Routes";
import { Item } from "../../redux/models/Items/Item";
import { Flex } from "../Flex/Flex";
import { FlatListItem } from "./FlatList/FlatListItem";
import { GalleryListItem } from "./GalleryList/GalleryListItem";

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
				{ (props.items || []).map(i => (
					<FlatListItem figures='on-end' selected={ props.selected === i._id } key={ i._id } itemId={ i._id } onClick={ () => handleClick(i) } />
				)) }
			</Flex>
		)

		default: return (
			<Flex column style={{ width: '100%' }}>
				{ (props.items || []).map(i => (
					<FlatListItem selected={ props.selected === i._id } key={ i._id } itemId={ i._id } onClick={ () => handleClick(i) } />
				)) }
			</Flex>
		)
	}

})