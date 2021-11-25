import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { DndItemTypes } from "../../constants/Dnd";
import { useItem } from "../../hooks/UseItem";
import { MoveOneItemAction } from "../../redux/actions/ItemActions";

interface ItemDropZoneProps {
	itemId: string
	children: any
}

export const ItemDropZone = React.memo((props: ItemDropZoneProps) => {

	const dispatch = useDispatch();
	const { item } = useItem(props.itemId);
	const [ , drag ] = useDrag(() => ({ type: DndItemTypes.Item, item: item }))
	const [ , drop ] = useDrop(() => ({
		accept: DndItemTypes.Item,
		drop: (dragged: any) => {
			dispatch(MoveOneItemAction(dragged._id, item?._id || ''))
		}
	}))

	return (
		<div ref={ drop }>
			<div ref={ drag }>
				{ props.children }
			</div>
		</div>
	)

})