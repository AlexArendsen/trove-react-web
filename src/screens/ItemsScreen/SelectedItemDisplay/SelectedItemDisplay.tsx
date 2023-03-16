import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../../components/Button/Button";
import { Flex } from "../../../components/Flex/Flex";
import { ItemDropZone } from "../../../components/ItemDropZone/ItemDropZone";
import { ItemInputForm } from "../../../components/ItemInputForm/ItemInputForm";
import { ItemList } from "../../../components/ItemList/ItemList";
import { Markdown } from "../../../components/Markdown/Markdown";
import { PlannerView } from "../../../components/PlannerView/PlannerView";
import { ProgressBar } from "../../../components/ProgressBar/ProgressBar";
import { Text } from "../../../components/Text/Text";
import { TextInput } from "../../../components/TextInput/TextInput";
import { TimeDisplay } from "../../../components/TimeDisplay/TimeDisplay";
import { useItem } from "../../../hooks/UseItem";
import { useSelectedItem } from "../../../hooks/UseSelectedItem";
import { useStore } from "../../../hooks/UseStore";
import { useWindowSize } from "../../../hooks/UseWindowSize";
import { UpdateOneItemAction } from "../../../redux/actions/ItemActions";
import { Item } from "../../../redux/models/Items/Item";
import './SelectedItemDisplay.css'

export const SelectedItemDisplay = React.memo(() => {

	const { item, children, parent, grandparent } = useSelectedItem();
	const { isMobile } = useWindowSize()

	const [ editing, setEditing ] = useState(false);

	const display = useMemo(() => {
		if (isMobile) return 'list'
		if (/#planner/.test(item?.description || '')) return 'planner';
		if (/#gallery/.test(item?.description || '')) return 'gallery';
		else return 'list';
	}, [ item, isMobile ])

	if (!item) return null;

	const classes = classNames({
		'selected-item-display': true,
		'selected-item-display-no-parent': (!parent && !grandparent) || isMobile,
		'selected-item-display-with-parent': !!parent && !grandparent && !isMobile,
		'selected-item-display-with-grandparent': !!grandparent && !isMobile,
	})

	if (display === 'planner') {

		return (
			<Flex column align='center' className={ classes }>

				<ProgressBar item={ item } />

				<div style={{ overflowY: 'scroll', maxWidth: '100%', minWidth: '100%', paddingBottom: 80 }}>
					<ItemDropZone itemId={ item._id } noDrag>
						<div style={{ margin: '50px 60px' }}>
							<SelectedItemEditor itemId={ item._id } onEditing={ setEditing } />
						</div>
					</ItemDropZone>

					<PlannerView itemId={ item._id } />
				</div>

			</Flex>
		)

	}

	return (
		<Flex column align='center' className={ classes }>

			<ProgressBar item={ item } />

			<Flex column align='center' className='selected-item-display-content-wrapper'>
				<Flex column className='selected-item-display-content'>
					<div style={{ margin: '0 20px' }}>
						<SelectedItemEditor itemId={ item._id } onEditing={ setEditing } />
						<ItemInputForm itemId={ item._id } style={{ marginTop: 20, marginBottom: 60, opacity: editing ? 0 : 1 }} />
					</div>
					<div className={ classNames({
						'selected-item-children': true,
						'selected-item-children-disabled': editing
					}) }>
						<ItemList items={ children } navOnClick={ !editing } display={ display } />
					</div>
				</Flex>
			</Flex>


		</Flex>
	)

})

interface SelectedItemEditorProps {
	itemId: string,
	onEditing?: (editing: boolean) => void
}

const SelectedItemEditor = React.memo((props: SelectedItemEditorProps) => {

	const { item } = useItem(props.itemId);

	const dispatch = useDispatch();
	const [ title, setTitle ] = useState(item?.title);
	const [ description, setDescription ] = useState(item?.description);
	const [ editing, setEditing ] = useState(false);

	const handleSubmit = () => {
		if (item && title) {
			dispatch(UpdateOneItemAction({ ...item, title, description }))
			setEditing(false);
		}
	}

	const canSubmit = !!title;

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.ctrlKey && e.key === 'Enter') handleSubmit();
		if (e.key === 'Escape') setEditing(false);
	}

	useEffect(() => {
		if(props.onEditing) props.onEditing(editing)
		setTitle(item?.title); setDescription(item?.description);
	}, [ editing ])
	useEffect(() => { setEditing(false); setTitle(item?.title); setDescription(item?.description) }, [ item ])

	if (!item) return null;

	if (editing) return (
		<Flex column>
			<TextInput value={ title } transparent style={{ fontSize: 36, fontWeight: 700 }} key='title' onKeyDown={ handleKeyDown } onChange={ setTitle } />
			<TextInput value={ description } transparent multiline key='description' onKeyDown={ handleKeyDown } onChange={ setDescription } 
				style={{ margin: '10px 0 30px 0', height: 500, padding: 15, background: 'rgba(0,0,0,0.04)', borderRadius: 18, maxWidth: 800 }} />
			<Flex row>
				<Button fullWidth variant='submit' disabled={ !canSubmit } onClick={ handleSubmit }>
					Save Changes
				</Button>
				<Button onClick={ () => setEditing(false) } style={{ width: 100, marginLeft: 15 }}>
					Cancel
				</Button>
			</Flex>
		</Flex>
	)

	return (
		<Flex column>
			<Text bold large className='selected-item-title' onClick={ () => setEditing(true) }>{ item.title }</Text>
			<Markdown src={ item.description } />
			<Flex row>
				<Text faded style={{ marginRight: 5 }}>Created</Text>
				<TimeDisplay time={ item.created_at } long />
			</Flex>
		</Flex>
	)

})