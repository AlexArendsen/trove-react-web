import classNames from "classnames";
import React, { useMemo } from "react";
import { useHistory } from "react-router";
import { Routes } from "../../constants/Routes";
import { useItem } from "../../hooks/UseItem";
import { Checkbox } from "../Checkbox/Checkbox";
import { Flex } from "../Flex/Flex";
import { ItemDropZone } from "../ItemDropZone/ItemDropZone";
import { ItemInputForm } from "../ItemInputForm/ItemInputForm";
import { FlatListItem } from "../ItemList/FlatList/FlatListItem";
import { ItemList } from "../ItemList/ItemList";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { Text } from "../Text/Text";
import './PlannerView.css';

interface PlannerViewProps {
	itemId: string
}

export const PlannerView = React.memo((props: PlannerViewProps) => {

	const { children, item } = useItem(props.itemId)
	const cardChildren = useMemo(() => children.filter(c => !!c.descendants), [ children ])
	const flatChildren = useMemo(() => children.filter(c =>  !c.descendants), [ children ])

	if(!item) return null;

	return (

		<Flex column className='planner-view-children'>

			<Flex row className='planner-view-carousel'>
				{ cardChildren.map(c => (
					<PlannerCard key={ c._id } itemId={ c._id } />
				)) }
			</Flex>

			<Flex center style={{ marginTop: 40 }}>
				<ItemInputForm style={{ maxWidth: 700 }} itemId={ item._id } />
			</Flex>

			<Flex column align='center' style={{ marginTop: 20 }}>
				<div style={{ maxWidth: 700, width: 700 }}>
					<ItemList items={ flatChildren } navOnClick display='list' />
				</div>
			</Flex>

		</Flex>
	)

})

const PlannerCard = React.memo((props: { itemId: string }) => {

	const { children, item } = useItem(props.itemId)

	if (!item) return null;

	return (
		<Flex column className='planner-view-card'>

			<div style={{ borderRadius: '12px 12px 0 0' }}>
				{/* TODO -- Image */}
				<ProgressBar item={ item } />
			</div>

			<Flex column style={{ margin: '15px 0', overflow: 'hidden', maxHeight: 88 }}>
				<SimpleItem itemId={ item._id } />
				<Text faded>{ item.description }</Text>
			</Flex>

			<Flex column className='planner-view-card-sublist'>
			{ children.map(c => (
				<PlannerCardSubItem key={ c._id } itemId={ c._id } />
			)) }
			</Flex>

		</Flex>
	)

})

const PlannerCardSubItem = React.memo((props: { itemId: string }) => {

	const { item } = useItem(props.itemId);

	if (!item) return null;

	return (
		<div className='planner-card-subitem'>
			<SimpleItem small itemId={ item._id } />
		</div>
	)

})

const SimpleItem = React.memo((props: { itemId: string, small?: boolean }) => {

	const history = useHistory();
	const { item } = useItem(props.itemId);
	const classes = classNames({
		'planner-card-item-large': !props.small,
		'planner-card-item-small': props.small,
		'planner-card-item': true
	})

	if (!item) return null;

	return (
		<ItemDropZone itemId={ item._id }>
			<Flex row className={ classes } align='flex-start' onClick={ () => history.push(Routes.item(item._id)) }>
				<Checkbox small={ props.small } itemId={ item._id } />
				<Text small={ props.small } medium={ !props.small } bold={ !props.small } style={{ marginLeft: 10 }}>{ item.title }</Text>
			</Flex>
		</ItemDropZone>
	)

})