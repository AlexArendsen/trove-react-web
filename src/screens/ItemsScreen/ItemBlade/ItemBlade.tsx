import classNames from "classnames";
import React, { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Flex } from "../../../components/Flex/Flex";
import { ItemDropZone } from "../../../components/ItemDropZone/ItemDropZone";
import { ProgressBar } from "../../../components/ProgressBar/ProgressBar";
import { useItem } from "../../../hooks/UseItem";
import { LensedComponent } from "../../../lenses/LensedComponent";
import { Item } from "../../../redux/models/Items/Item";
import './ItemBlade.css';

interface ItemBladeProps {
	itemId: string
	selected?: string
	style?: React.CSSProperties
	onItemClick?: (item: Item) => void
	darken?: boolean
}

export const ItemBlade = React.memo((props: ItemBladeProps) => {

	const { item } = useItem(props.itemId);

	const handleTitleClick = useCallback(() => { if (item) props.onItemClick?.(item) }, [item, props.onItemClick])
	const handleChildClick = useCallback((item: Item) => { props.onItemClick?.(item) }, [props.onItemClick])

	if (!item) return null;

	return (
		<Flex column align='center' className={classNames({
			'item-blade': true,
			'item-blade-darken': props.darken
		})} style={ props.style }>

			<ProgressBar item={ item } />

			<Flex column className='item-blade-content'>
				<div style={{ padding: 20 }}>
					<ItemDropZone itemId={ item._id }>
						<LensedComponent itemId={ item._id } selector={ l => l.AsAncestor?.RenderHeader } props={{ itemId: item._id, onClick: handleTitleClick }} />
					</ItemDropZone>
					{ item.description ? <ReactMarkdown>{ item.description }</ReactMarkdown> : null }
					<LensedComponent itemId={ item._id } selector={ l => l.AsAncestor?.RenderNewItemInputForm } props={{ itemId: item._id }} />
				</div>
				<LensedComponent itemId={ item._id } selector={ l => l.AsAncestor?.RenderChildList } props={{ itemId: item._id, selectedItemId: props.selected, onClick: handleChildClick }} />
			</Flex>

		</Flex>
	)

})
