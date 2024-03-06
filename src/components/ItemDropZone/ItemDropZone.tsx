import classNames from "classnames";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { DndItemTypes } from "../../constants/Dnd";
import { useItem } from "../../hooks/UseItem";
import { Item } from "../../redux/models/Items/Item";
import './ItemDropZone.css';
import { ItemSort } from "../../redux/models/Items/ItemSort";
import { useItemStore } from "../../stores/ItemStore/useItemStore";

interface ItemDropZoneProps {
	itemId?: string | null
	children: any
	noDrag?: boolean
	noDrop?: boolean
	onDrop?: (dropped: Item) => void
}

export const ItemDropZone = React.memo((props: ItemDropZoneProps) => {

	const { itemId, children, noDrag, noDrop, onDrop } = props
	const { item } = useItem(itemId);

	const [ , drag ] = useDrag(() => ({ type: DndItemTypes.Item, item: item }))
	const [ { dangling }, drop ] = useDrop(() => ({
		accept: DndItemTypes.Item,
		drop: (dragged: any) => {
			if (onDrop) onDrop(dragged)
			else if (item?._id) useItemStore.getState().moveOne(dragged._id, item?._id || '')
		},
		canDrop: (dragging: Item) => !item?._id || dragging._id !== item?._id,
		collect: (monitor) => {
			return { dangling: monitor.isOver() && monitor.canDrop() }
		}
	}), [ itemId, item ])

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

const SORT_SPREAD = 50; // Amount of space we put between items by default
const createSortingActions = (itemId: string, to: number, newParent?: string): ItemSort[] => {


	const item = useItemStore.getState().byId[itemId]
	const parentId = newParent || item?.parent_id || ''
	if (!item) return [];
	let siblings = useItemStore.getState().byParent[parentId]
	if (!siblings?.length) return [];

	// We're also moving this item to a new parent; quick slap it on the end of the siblings list
	if (item.parent_id != parentId) {
		siblings.push(item)
	}

	const from = siblings.findIndex(s => s._id === itemId)
	if (to === from || (to === from + 1)) return []


	const actions: ItemSort[] = []

	const swapAndRerank = () => {
		// Swap to intended position
		const deletedItem = siblings.splice(from, 1)[0] // Delete moving item
		const adjTo = (from < to) ? to - 1 : to // If we just deleted something before the destination, we need to adjust our target
		siblings.splice(Math.max(0, adjTo), 0, item) // Re-add it where it needs to go

		// Strip packed siblings with ranks
		let last = -Infinity
		for(let i = 0; i < siblings.length; ++i) {
			const loopItem = siblings[i]
			if (i === 0) {
				actions.push({ itemId: loopItem._id, newRank: SORT_SPREAD * 20, newParent });
				last = SORT_SPREAD * 20;
			} else if ((siblings[i].rank || -1) - last > SORT_SPREAD) {
				last = siblings[i].rank || -1
			} else {
				actions.push({ itemId: loopItem._id, newRank: last + SORT_SPREAD, newParent });
				last = last + SORT_SPREAD
			}
		}
	}

	// Case 1: Rank information is missing. Swap and add rank information to the list
	if (siblings.some(s => typeof s.rank !== 'number')) {
		swapAndRerank()

	// Case 2: Adding to beginning of list
	} else if (to <= 0) {
		if (siblings[0].rank! > SORT_SPREAD) actions.push({ itemId, newRank: siblings[0].rank! - SORT_SPREAD, newParent })
		else swapAndRerank()
		
	// Case 3: Adding to end of list
	} else if (to >= siblings.length) {
		actions.push({ itemId, newRank: siblings[siblings.length - 1].rank! + SORT_SPREAD, newParent })

	// Case 4: Putting somewhere in the middle of the list
	} else {
		const left = siblings[to - 1]
		const right = siblings[to]
		const space = right.rank! - left.rank!
		if (space <= 1) swapAndRerank()
		else actions.push({ itemId, newRank: Math.round(left.rank! + (space / 2)), newParent })
	}

	return actions

}

export const ItemSortingDropZone = React.memo((props: {
	dropIdx: number,
	parentId?: string,
	short?: boolean
}) => {

	const { dropIdx, parentId, short } = props
	const [ { dangling, dragging }, drop ] = useDrop(() => ({
		accept: DndItemTypes.Item,
		drop: (dragged: any) => {
			const updates = createSortingActions(dragged._id, dropIdx, parentId)
			useItemStore.getState().sort(updates)
		},
		//canDrop: (dragging: Item) => !item?._id || dragging._id !== item?._id,
		collect: (monitor) => {
			return {
				dragging: !!monitor.getItem(),
				dangling: monitor.isOver() && monitor.canDrop()
			}
		}
	}), [ parentId, dropIdx ])

	const classes = classNames({
		'sort-zone': true,
		'sort-zone-short': short,
		'sort-zone-tall': !short,
		'sort-zone-dragging': dragging,
		'sort-zone-dangle': dangling
	})

	return (
		<div ref={ drop } className={ classes }>
			<div className='sort-zone-line'></div>
		</div>
	)

})