import classNames from "classnames";
import React, { useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useHistory } from "react-router";
import { Flex } from "../../../components/Flex/Flex";
import { ItemDropZone } from "../../../components/ItemDropZone/ItemDropZone";
import { ItemInputForm } from "../../../components/ItemInputForm/ItemInputForm";
import { ItemList } from "../../../components/ItemList/ItemList";
import { ProgressBar } from "../../../components/ProgressBar/ProgressBar";
import { Text } from "../../../components/Text/Text";
import { Routes } from "../../../constants/Routes";
import { useItem } from "../../../hooks/UseItem";
import './ItemBlade.css';

interface ItemBladeProps {
	itemId: string
	selected?: string
	style?: React.CSSProperties
	darken?: boolean
}

export const ItemBlade = React.memo((props: ItemBladeProps) => {

	const history = useHistory();
	const { item, children } = useItem(props.itemId);

	const handleTitleClick = useCallback(() => {
		if (item) history.push(Routes.item(item._id))
	}, [ item ])

	if (!item) return null;

	return (
		<Flex column align='center' className={classNames({
			'item-blade': true,
			'item-blade-darken': props.darken
		})} style={ props.style }>

			{/* TODO -- Image */}

			<ProgressBar item={ item } />

			<Flex column className='item-blade-content'>
				<div style={{ padding: 20 }}>
					<ItemDropZone itemId={ item._id }>
						<Text bold mediumLarge onClick={ handleTitleClick } style={{ cursor: 'pointer' }}> { item.title } </Text>
					</ItemDropZone>
					{ item.description ? <ReactMarkdown>{ item.description }</ReactMarkdown> : null }
					<ItemInputForm darker itemId={ item._id } style={{ margin: '20px 0' }} />
				</div>
				<ItemList selected={ props.selected } items={ children } display='compact-list' navOnClick />
			</Flex>

		</Flex>
	)

})