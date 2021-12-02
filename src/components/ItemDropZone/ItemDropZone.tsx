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
	itemId: string | null
	children: any
	noDrag?: boolean
	noDrop?: boolean
}

export const ItemDropZone = React.memo((props: ItemDropZoneProps) => {

	const dispatch = useDispatch();
	const { item } = useItem(props.itemId);

	const [ , drag ] = useDrag(() => ({ type: DndItemTypes.Item, item: item }))
	const [ { dangling }, drop ] = useDrop(() => ({
		accept: DndItemTypes.Item,
		drop: (dragged: any) => {
			dispatch(MoveOneItemAction(dragged._id, item?._id || ''))
		},
		canDrop: (dragging: Item) => dragging._id !== item?._id,
		collect: (monitor) => {
			return { dangling: monitor.isOver() && monitor.canDrop() }
		}
	}))

	if (!item) return props.children;

	const classes = classNames({
		'drop-zone': true,
		'drop-zone-dangle': dangling
	})

	return (
		<div ref={ props.noDrop ? undefined : drop } className={ classes }>
			<div ref={ props.noDrag ? undefined : drag }>
				{ props.children }
			</div>
		</div>
	)

})