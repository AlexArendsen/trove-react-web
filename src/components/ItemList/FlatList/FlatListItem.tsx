import classNames from "classnames";
import React, { useMemo } from "react";
import { useItem } from "../../../hooks/UseItem";
import { useItemEditor } from "../../../stores/useItemEditor";
import { FormatNumber } from "../../../utils/FormatNumber";
import { Checkbox } from "../../Checkbox/Checkbox";
import { Flex } from "../../Flex/Flex";
import { ItemDropZone } from "../../ItemDropZone/ItemDropZone";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import './FlatListItem.css';
import { TrText } from "../../Text/Text";
import { Bump } from "../../Bump/Bump";

interface FlatListItemProps {
	itemId: string
	selected?: boolean
	figures?: 'visible' | 'on-end' | 'hidden'
	onClick?: () => void
	withouthCheckboxes?: boolean
}

export const FlatListItem = React.memo((props: FlatListItemProps) => {

	const { item } = useItem(props.itemId)
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

					{ props.withouthCheckboxes ? <Bump w={ 25 } /> : (
						<Flex row justify='center' style={{ width: 50, marginRight: 15 }}>
							<Checkbox checked={ checked } itemId={ item?._id } hitSlop='full' />
						</Flex>
					) }

					<Flex column style={{ flex: 2 }}>
						<TrText medium bold className='flat-list-item-title'>{ item?.title }</TrText>
					</Flex>

					{ isNaN(pct) ? null : (<Flex column style={{ marginLeft: 15, flex: 1 }} align='flex-end'>
						<ProgressBar floating item={ item } />
						{
							((props.figures || 'visible') === 'visible') ? (<Flex row>
								<TrText small accent>{ FormatNumber.withCommas(item?.completed || 0) }</TrText>
								<TrText small faded style={{ marginLeft: 5, marginRight: 20, whiteSpace: 'nowrap' }}> / { FormatNumber.withCommas(item?.descendants || 0) }</TrText>
								<TrText small accent bold>{ FormatNumber.toPercent(pct) }</TrText>
							</Flex>) : null
						}
					</Flex>) }

					{ (props.figures === 'on-end' && item?.descendants) ? (
						<Flex row justify='flex-end' align='center' style={{ width: 40 }}>
							<TrText small faded style={{ opacity: 0.8 }}>{ FormatNumber.withCommas(item?.descendants || 0) }</TrText>
						</Flex>
					) : null }

					{/* TODO -- Image */}

				</Flex>

				{ item?.description ? (<div style={{ maxHeight: 40, marginLeft: 65, overflow: 'hidden' }}>
					<TrText small faded>{ item?.description }</TrText>
				</div>) : null }

			</Flex>

		</ItemDropZone>
	)

})