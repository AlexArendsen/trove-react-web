import classNames from "classnames";
import React, { useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { DndItemTypes } from "../../../constants/Dnd";
import { useItem } from "../../../hooks/UseItem";
import { DeleteOneItemAction, MoveOneItemAction } from "../../../redux/actions/ItemActions";
import { FormatNumber } from "../../../utils/FormatNumber";
import { Button } from "../../Button/Button";
import { Checkbox } from "../../Checkbox/Checkbox";
import { Flex } from "../../Flex/Flex";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { Text } from "../../Text/Text";
import { TimeDisplay } from "../../TimeDisplay/TimeDisplay";
import './FlatListItem.css';

interface FlatListItemProps {
	itemId: string
	selected?: boolean
	hideFigures?: boolean
	hideDate?: boolean
	onClick?: () => void
}

export const FlatListItem = React.memo((props: FlatListItemProps) => {

	const dispatch = useDispatch();
	const { item, children } = useItem(props.itemId)
	const [ , drag ] = useDrag(() => ({ type: DndItemTypes.Item, item: item }))
	const [ , drop ] = useDrop(() => ({
		accept: DndItemTypes.Item,
		drop: (dragged: any) => {
			console.info({ moving: dragged?.title, to: item?.title })
			dispatch(MoveOneItemAction(dragged._id, item?._id || ''))
		}
	}))
	const checked = useMemo(() => item?.checked, [ item ])

	// TODO -- Use some kind of global relay to figure out if you're the one single context menu'd item
	const handleRightClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setRightClicked(!rightClicked);
	}

	const handleDelete = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (item) dispatch(DeleteOneItemAction(item._id))
	}

	const [ rightClicked, setRightClicked ] = useState(false);

	const pct = useMemo(() => {
		if (!item?.descendants) return NaN;
		return (item.completed || 0) / (item.descendants || 1)
	}, [ item ])

	return (
		<div ref={ drop }>
			<div ref={ drag }>

				<Flex column justify='flex-start' className={classNames({
						'flat-list-item': true,
						'flat-list-item-checked': checked,
						'flat-list-item-selected': props.selected,
						'flat-list-item-right-clicked': rightClicked,
					})} onClick={ props.onClick } onContextMenu={ handleRightClick }>

					<Flex row align='center'>

						<Flex row justify='center' style={{ width: 50, marginRight: 15 }}>
							<Checkbox checked={ checked } itemId={ item?._id } />
						</Flex>

						<Flex column style={{ flex: 2 }}>
							<Text medium bold className='flat-list-item-title'>{ item?.title }</Text>
						</Flex>

						{ isNaN(pct) ? null : (<Flex column style={{ margin: '0 15px', flex: 1 }} align='flex-end'>
							<ProgressBar floating item={ item } />
							{ props.hideFigures ? null : (<Flex row>
								<Text small accent>{ FormatNumber.withCommas(item?.completed || 0) }</Text>
								<Text small faded style={{ marginLeft: 5, marginRight: 20 }}> / { FormatNumber.withCommas(item?.descendants || 0) }</Text>
								<Text small accent bold>{ FormatNumber.toPercent(pct) }</Text>
							</Flex>) }
						</Flex>) }

						{/* TODO -- Image */}

						{ (rightClicked || props.hideDate) ? null : <TimeDisplay style={{ width: 50 }} time={ item?.created_at } /> }
						{ rightClicked ? <Button onClick={ handleDelete } style={{ background: '#C32986', color: 'white' }}>Delete</Button> : null }


					</Flex>

					{/* { isNaN(pct) ? null : (
						<Flex row align='center' style={{ marginTop: 10 }}>
							<Flex row style={{ minWidth: 160 }}>
								<Flex row justify='center' style={{ width: 50, marginRight: 15 }}>
									<Text small accent bold>{ FormatNumber.toPercent(pct) }</Text>
								</Flex>
								<Text small accent style={{ marginRight: 5 }}>{ FormatNumber.withCommas(item?.completed || 0) }</Text>
								<Text small faded> / { FormatNumber.withCommas(item?.descendants || 0) }</Text>
							</Flex>
							<ProgressBar floating percent={ pct } />
						</Flex>
					) } */}

					{/* { isNaN(pct) ? null : (
						<Flex row align='center' style={{ marginTop: 8 }}>
							<Flex row justify='center' style={{ width: 50, marginRight: 17, marginLeft: 7 }}>
								<Text small faded>{ FormatNumber.toPercent(pct) }</Text>
							</Flex>
							<ProgressBar floating percent={ pct } />
						</Flex>
					) } */}

					{ item?.description ? (<div style={{ maxHeight: 40, marginLeft: 65, overflow: 'hidden' }}>
						<Text small faded>{ item?.description }</Text>
					</div>) : null }

				</Flex>
			</div>
		</div>
	)

})