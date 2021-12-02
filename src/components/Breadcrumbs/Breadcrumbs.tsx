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

export const Breadcrumbs = React.memo(() => {

	const { item } = useSelectedItem();

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
				<Crumb title='Home' />
				{ lineage.map((l, idx) => <Crumb title={ l.title } item={ l } last={ (idx + 1) === lineage.length } />) }
			</Flex>
		</div>
	)

})

interface CrumbProps {
	title: string,
	item?: Item | null
	last?: boolean
}

const Crumb = React.memo((props: CrumbProps) => {

	const history = useHistory()

	return (
		<ItemDropZone itemId={ props.item?._id || null }>
			<Flex row align='center' className='crumb' onClick={() => history.push(Routes.item(props.item?._id || ''))}>
					<Text style={{ marginRight: 12 }} bold>{ props.title }</Text>
					<Text medium>›</Text>
			</Flex>
		</ItemDropZone>
	)

})