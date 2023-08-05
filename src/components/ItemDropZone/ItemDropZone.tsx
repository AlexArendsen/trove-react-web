import classNames from "classnames";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { DndItemTypes } from "../../constants/Dnd";
import { useItem } from "../../hooks/UseItem";
import { MoveOneItemAction } from "../../redux/actions/ItemActions";
import { Item } from "../../redux/models/Items/Item";
import './ItemDropZone.css';

interface ItemDropZoneProps {
	itemId?: string | null
	children: any
	noDrag?: boolean
	noDrop?: boolean
	onDrop?: (dropped: Item) => void
}

export const ItemDropZone = React.memo((props: ItemDropZoneProps) => {

	const dispatch = useDispatch();
	const { itemId, children, noDrag, noDrop, onDrop } = props
	const { item } = useItem(itemId);

	const [ , drag ] = useDrag(() => ({ type: DndItemTypes.Item, item: item }))
	const [ { dangling }, drop ] = useDrop(() => ({
		accept: DndItemTypes.Item,
		drop: (dragged: any) => {
			if (onDrop) onDrop(dragged)
			else if (item?._id) dispatch(MoveOneItemAction(dragged._id, item?._id || ''))
		},
		canDrop: (dragging: Item) => !item?._id || dragging._id !== item?._id,
		collect: (monitor) => {
			return { dangling: monitor.isOver() && monitor.canDrop() }
		}
	}))

	const classes = classNames({
		'drop-zone': true,
		'drop-zone-dangle': dangling
	})

	return (
		<div ref={ noDrop ? undefined : drop } className={ classes }>
			<div ref={ noDrag ? undefined : drag }>
				{ children }
			</div>
		</div>
	)

})