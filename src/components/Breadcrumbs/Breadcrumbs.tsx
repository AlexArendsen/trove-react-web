import React, { useMemo } from "react";
import { useHistory } from "react-router";
import { Routes } from "../../constants/Routes";
import { useItem } from "../../hooks/UseItem";
import { useSelectedItem } from "../../hooks/UseSelectedItem";
import { Item } from "../../redux/models/Items/Item";
import { useItemStore } from "../../stores/ItemStore/useItemStore";
import { Flex } from "../Flex/Flex";
import { ItemDropZone } from "../ItemDropZone/ItemDropZone";
import { TrText } from "../Text/Text";
import './Breadcrumbs.css';

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
	reverse?: boolean
	onSelectCrumb: (item: Item | null) => void
}) => {

	const { itemId, reverse, onSelectCrumb } = props

	const item = useItem(itemId)?.item;

	const lineage = useMemo(() => {
		if (!item) return [];
		const lookup = useItemStore.getState().byId
		let l: Item[] = [item]
		let i = item
		while (!!i?.parent_id) {
			l.unshift(lookup[i.parent_id])
			i = lookup[i.parent_id]
		}
		return reverse ? l.reverse() : l
	}, [item, reverse])

	return (
		<div style={{ overflow: 'scroll' }}>
			<Flex row style={{ margin: '4px 0', whiteSpace: 'nowrap' }}>
				{lineage.map((l, idx) => {
					const isLast = (idx + 1) === lineage.length
					const caretChar = reverse ? '‹' : '›'
					return <Crumb title={l?.title || 'UNKNOWN'} item={l} caret={ isLast ? '' : caretChar } onClick={() => onSelectCrumb(l)} />
				})
				}
			</Flex>
		</div>
	)

})

interface CrumbProps {
	title: string
	item?: Item | null
	caret?: string
	onClick: () => void
}

const Crumb = React.memo((props: CrumbProps) => {

	return (
		<Flex row align='center'>
			<ItemDropZone itemId={props.item?._id || null}>
				<Flex row align='center' className='crumb' onClick={props.onClick}>
					<TrText small bold style={{ color: 'inherit' }}>{props.title}</TrText>
				</Flex>
			</ItemDropZone>
			{props.caret ? <TrText medium faded>{props.caret}</TrText> : null}
		</Flex>
	)

})