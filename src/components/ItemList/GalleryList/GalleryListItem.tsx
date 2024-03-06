import classNames from "classnames"
import React from "react"
import { Colors } from "../../../constants/Colors"
import { useItem } from "../../../hooks/UseItem"
import { useItemStore } from "../../../stores/ItemStore/useItemStore"
import { useItemEditor } from "../../../stores/useItemEditor"
import { Checkbox } from "../../Checkbox/Checkbox"
import { Flex } from "../../Flex/Flex"
import { Text } from "../../Text/Text"
import { TimeDisplay } from "../../TimeDisplay/TimeDisplay"
import './GalleryListItem.css'

interface GalleryListItemProps {
	itemId: string,
	onClick?: () => void,
	showParent?: boolean
}

export const GalleryListItem = React.memo((props: GalleryListItemProps) => {

	const { item } = useItem(props.itemId);
	const parent = useItemStore(s => item?.parent_id ? s.byId[item?.parent_id] : null)

	const handleRightClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		e.preventDefault()
		useItemEditor.getState().open(props.itemId)
	}

	return (
		<Flex column onClick={ props.onClick } onContextMenu={ handleRightClick } className={classNames({
			'gallery-list-item': true,
			'gallery-list-item-checked': item?.checked
		})}>
			<div style={{ flex: 1, maxHeight: 235, overflow: 'hidden' }}>
				<Text small faded>{ props.showParent ? parent?.title : null }</Text>
				<Flex row style={{ margin: '8px 0 8px 0' }}>
					<Checkbox checked={ item?.checked } itemId={ item?._id } />
					<Text bold medium style={{ flex: 1, marginLeft: 12, color: (item?.checked ? Colors.Accent1 : undefined) }}>{ item?.title }</Text>
				</Flex>
				<Text small faded>{ item?.description }</Text>
			</div>
			<Flex row justify='flex-end'>
				<TimeDisplay time={ item?.created_at } />
			</Flex>
		</Flex>
	)

})