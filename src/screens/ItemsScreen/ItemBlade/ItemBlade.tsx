import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { useHistory } from "react-router";
import { Flex } from "../../../components/Flex/Flex";
import { ItemDropZone } from "../../../components/ItemDropZone/ItemDropZone";
import { ItemInputForm } from "../../../components/ItemInputForm/ItemInputForm";
import { ItemList } from "../../../components/ItemList/ItemList";
import { ProgressBar } from "../../../components/ProgressBar/ProgressBar";
import { Routes } from "../../../constants/Routes";
import { useItem } from "../../../hooks/UseItem";
import { useLenses } from "../../../hooks/UseItemLens";
import { ItemLens, ItemLensItemSpec } from "../../../lenses/ItemLens";
import './ItemBlade.css';
import { LensedComponent } from "../../../lenses/LensedComponent";
import { DefaultItemLens } from "../../../lenses/DefaultItemLens";

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

			<ProgressBar item={ item } />

			<Flex column className='item-blade-content'>
				<div style={{ padding: 20 }}>
					<ItemDropZone itemId={ item._id }>
						<LensedComponent itemId={ item._id } selector={ l => l.AsAncestor?.RenderHeader } props={{ itemId: item._id, onClick: handleTitleClick }} />
					</ItemDropZone>
					{ item.description ? <ReactMarkdown>{ item.description }</ReactMarkdown> : null }
					<LensedComponent itemId={ item._id } selector={ l => l.AsAncestor?.RenderNewItemInputForm } props={{ itemId: item._id }} />
				</div>
				<LensedComponent itemId={ item._id } selector={ l => l.AsAncestor?.RenderChildList } props={{ itemId: item._id, selectedItemId: props.selected }} />
			</Flex>

		</Flex>
	)

})
