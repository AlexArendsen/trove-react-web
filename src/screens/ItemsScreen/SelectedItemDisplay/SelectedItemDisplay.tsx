import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../../components/Button/Button";
import { Flex } from "../../../components/Flex/Flex";
import { Markdown } from "../../../components/Markdown/Markdown";
import { ProgressBar } from "../../../components/ProgressBar/ProgressBar";
import { Text } from "../../../components/Text/Text";
import { TextInput } from "../../../components/TextInput/TextInput";
import { TimeDisplay } from "../../../components/TimeDisplay/TimeDisplay";
import { useItem } from "../../../hooks/UseItem";
import { useSelectedItem } from "../../../hooks/UseSelectedItem";
import { useWindowSize } from "../../../hooks/UseWindowSize";
import { LensedComponent } from "../../../lenses/LensedComponent";
import { UpdateOneItemAction } from "../../../redux/actions/ItemActions";
import './SelectedItemDisplay.css';
import { useLenses } from "../../../hooks/UseItemLens";

export const SelectedItemDisplay = React.memo(() => {

	const { item, parent, grandparent } = useSelectedItem();
	const { isMobile } = useWindowSize()

	const [ editing, setEditing ] = useState(false);
	const lens = useLenses(item?._id)
	const narrow = !lens.some(l => l.FullWidthSelected)

	if (!item) return null;

	const displayClasses = classNames({
		'selected-item-display': true,
		'selected-item-display-no-parent': (!parent && !grandparent) || isMobile,
		'selected-item-display-with-parent': !!parent && !grandparent && !isMobile,
		'selected-item-display-with-grandparent': !!grandparent && !isMobile,
	})

	const contentClasses = classNames({
		'selected-item-display-content': true,
		'selected-item-display-content-narrow': narrow
	})

	return (
		<Flex column align='center' className={ displayClasses }>

			<ProgressBar item={ item } />

			<Flex column align='center' className='selected-item-display-content-wrapper' style={{ paddingTop: isMobile ? 20 : 60 }}>
				<Flex column className={ contentClasses }>
					<div style={{ margin: '0 20px' }}>
						<LensedComponent itemId={ item?._id }
							selector={ l => editing ? l.AsSelected?.RenderEditor : l.AsSelected?.RenderHeader }
							props={{ itemId: item?._id, onDone: () => setEditing(false), onClick: () => setEditing(true) }} />
						<LensedComponent itemId={ item?._id } selector={ l => l.AsSelected?.RenderNewItemInputForm } props={{ itemId: item?._id }} />
					</div>
					<div className={ classNames({
						'selected-item-children': true,
						'selected-item-children-disabled': editing
					}) }>
						<LensedComponent itemId={ item?._id } selector={ l => l.AsSelected?.RenderChildList } props={{ itemId: item?._id }} />
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

export const DefaultItemEditor = React.memo((props: SelectedItemEditorProps) => {

	const { item } = useItem(props.itemId);
	const [ editing, setEditing ] = useState(false);

	if (!item) return null;
	if (editing) return <DefaultItemEditorControls itemId={ props.itemId } onDone={ () => setEditing(false) } />
	return <DefaultItemEditorDisplay itemId={ props.itemId } onClick={ () => setEditing(true) } />


})

export const DefaultItemEditorControls = React.memo((props: { itemId: string, onDone: () => void }) => {

	const dispatch = useDispatch();
	const { itemId, onDone } = props
	const { item } = useItem(itemId)

	const [ title, setTitle ] = useState(item?.title);
	const [ description, setDescription ] = useState(item?.description);

	const canSubmit = !!title;

	const handleSubmit = () => {
		if (item && title) {
			dispatch(UpdateOneItemAction({ ...item, title, description }))
			onDone()
		}
	}

	useEffect(() => { setTitle(item?.title); setDescription(item?.description); }, [ item ])

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.ctrlKey && e.key === 'Enter') handleSubmit();
		if (e.key === 'Escape') onDone();
	}

	return (
		<Flex column style={{ maxWidth: 800 }}>
			<TextInput value={ title } transparent style={{ fontSize: 36, fontWeight: 700 }} key='title' onKeyDown={ handleKeyDown } onChange={ setTitle } />
			<TextInput value={ description } transparent multiline key='description' onKeyDown={ handleKeyDown } onChange={ setDescription } 
				style={{ margin: '10px 0 30px 0', height: 500, padding: 15, background: 'rgba(0,0,0,0.04)', borderRadius: 18, maxWidth: 800 }} />
			<Flex row>
				<Button fullWidth variant='submit' disabled={ !canSubmit } onClick={ handleSubmit }>
					Save Changes
				</Button>
				<Button onClick={ onDone } style={{ width: 100, marginLeft: 15 }}>
					Cancel
				</Button>
			</Flex>
		</Flex>
	)
})

export const DefaultItemEditorDisplay = React.memo((props: { itemId: string, onClick: () => void }) => {

	const { item } = useItem(props.itemId)

	return (
		<Flex column style={{ maxWidth: 800 }}>
			<Text bold large className='selected-item-title' onClick={ props.onClick }>{ item?.title }</Text>
			<Markdown src={ item?.description } />
			<Flex row>
				<Text faded style={{ marginRight: 5 }}>Created</Text>
				<TimeDisplay time={ item?.created_at } long />
			</Flex>
		</Flex>
	)

})