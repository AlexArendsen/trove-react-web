import React, { useMemo } from "react";
import { useHistory } from "react-router";
import { Routes } from "../../constants/Routes";
import { useSelectedItem } from "../../hooks/UseSelectedItem";
import { Item } from "../../redux/models/Items/Item";
import { GetConfig } from "../../utils/Config";
import { Flex } from "../Flex/Flex";
import { ItemDropZone } from "../ItemDropZone/ItemDropZone";
import { Text } from "../Text/Text";
import './Breadcrumbs.css'
import { useItem } from "../../hooks/UseItem";

export const SelectedItemBreadcrumbs = React.memo(() => {

	const selectedItem = useSelectedItem()?.item as Item | undefined
	const history = useHistory()

	return <Breadcrumbs
		itemId={selectedItem?._id}
		onSelectCrumb={(i) => history.push(Routes.item(i?._id || ''))}
	/>

})

export const Breadcrumbs = React.memo((props: {
	itemId?: string
	onSelectCrumb: (item: Item | null) => void
}) => {

	const { itemId, onSelectCrumb } = props

	const item = useItem(itemId)?.item;

	const lineage = useMemo(() => {
		if (!item) return [];
		const lookup = GetConfig().Store?.getState().items.byId || {};
		let l: Item[] = [ item ]
		let i = item
		while (!!i?.parent_id) {
			l.unshift(lookup[i.parent_id])
			i = lookup[i.parent_id]
		}
		return l;
	}, [ item ])

	return (
		<div style={{ overflow: 'scroll' }}>
			<Flex row style={{ margin: '4px 0', whiteSpace: 'nowrap' }}>
				<Crumb title='Home' onClick={ () => onSelectCrumb(null) } />
				{ lineage.map((l, idx) => <Crumb title={ l?.title || 'UNKNOWN' } item={ l } isLast={ (idx + 1) === lineage.length } onClick={ () => onSelectCrumb(l) } />) }
			</Flex>
		</div>
	)

})

interface CrumbProps {
	title: string
	item?: Item | null
	isLast?: boolean
	onClick: () => void
}

const Crumb = React.memo((props: CrumbProps) => {

	return (
		<ItemDropZone itemId={ props.item?._id || null }>
			<Flex row align='center' className='crumb' onClick={ props.onClick }>
					<Text style={{ marginRight: 12 }} bold>{ props.title }</Text>
					<Text medium>›</Text>
			</Flex>
		</ItemDropZone>
	)

})