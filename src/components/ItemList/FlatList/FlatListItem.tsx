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
import { ItemDropZone } from "../../ItemDropZone/ItemDropZone";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { Text } from "../../Text/Text";
import { TimeDisplay } from "../../TimeDisplay/TimeDisplay";
import './FlatListItem.css';
import { useItemEditor } from "../../../stores/useItemEditor";

interface FlatListItemProps {
	itemId: string
	selected?: boolean
	figures?: 'visible' | 'on-end' | 'hidden'
	onClick?: () => void
}

export const FlatListItem = React.memo((props: FlatListItemProps) => {

	//const ed = useItemEditor()
	const dispatch = useDispatch();
	const { item, children } = useItem(props.itemId)
	const checked = useMemo(() => item?.checked, [ item ])

	const handleRightClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!!item) useItemEditor.getState().open(item._id)
	}

	const pct = useMemo(() => {
		if (!item?.descendants) return NaN;
		return (item.completed || 0) / (item.descendants || 1)
	}, [ item ])

	if (!item) return null;

	return (
		<ItemDropZone itemId={ item?._id }>

			<Flex column justify='flex-start' className={classNames({
					'flat-list-item': true,
					'flat-list-item-checked': checked,
					'flat-list-item-selected': props.selected,
				})} onClick={ props.onClick } onContextMenu={ handleRightClick }>

				<Flex row align='center'>

					<Flex row justify='center' style={{ width: 50, marginRight: 15 }}>
						<Checkbox checked={ checked } itemId={ item?._id } />
					</Flex>

					<Flex column style={{ flex: 2 }}>
						<Text medium bold className='flat-list-item-title'>{ item?.title }</Text>
					</Flex>

					{ isNaN(pct) ? null : (<Flex column style={{ marginLeft: 15, flex: 1 }} align='flex-end'>
						<ProgressBar floating item={ item } />
						{
							((props.figures || 'visible') === 'visible') ? (<Flex row>
								<Text small accent>{ FormatNumber.withCommas(item?.completed || 0) }</Text>
								<Text small faded style={{ marginLeft: 5, marginRight: 20, whiteSpace: 'nowrap' }}> / { FormatNumber.withCommas(item?.descendants || 0) }</Text>
								<Text small accent bold>{ FormatNumber.toPercent(pct) }</Text>
							</Flex>) : null
						}
					</Flex>) }

					{ (props.figures === 'on-end' && item?.descendants) ? (
						<Flex row justify='flex-end' align='center' style={{ width: 40 }}>
							<Text small faded style={{ opacity: 0.8 }}>{ FormatNumber.withCommas(item?.descendants || 0) }</Text>
						</Flex>
					) : null }

					{/* TODO -- Image */}

				</Flex>

				{ item?.description ? (<div style={{ maxHeight: 40, marginLeft: 65, overflow: 'hidden' }}>
					<Text small faded>{ item?.description }</Text>
				</div>) : null }

			</Flex>

		</ItemDropZone>
	)

})