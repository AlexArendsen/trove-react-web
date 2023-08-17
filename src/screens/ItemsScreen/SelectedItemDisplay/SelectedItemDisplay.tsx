import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../../components/Button/Button";
import { Flex } from "../../../components/Flex/Flex";
import { Markdown } from "../../../components/Markdown/Markdown";
import { ProgressBar } from "../../../components/ProgressBar/ProgressBar";
import { Text, TrText } from "../../../components/Text/Text";
import { TextInput } from "../../../components/TextInput/TextInput";
import { TimeDisplay } from "../../../components/TimeDisplay/TimeDisplay";
import { useItem } from "../../../hooks/UseItem";
import { useSelectedItem } from "../../../hooks/UseSelectedItem";
import { useWindowSize } from "../../../hooks/UseWindowSize";
import { LensedComponent } from "../../../lenses/LensedComponent";
import { UpdateOneItemAction } from "../../../redux/actions/ItemActions";
import './SelectedItemDisplay.css';
import { useLenses } from "../../../hooks/UseItemLens";
import { ModalPopover } from "../../../components/Popover/ModalPopover";
import { useItemEditor } from "../../../stores/useItemEditor";
import { ItemEditorFrame } from "../../../components/ItemEditor/ItemEditorFrame";
import { Bump } from "../../../components/Bump/Bump";

export const SelectedItemDisplay = React.memo(() => {

	const { item, parent, grandparent } = useSelectedItem();
	const { isMobile } = useWindowSize()

	const [ editing, setEditing ] = useState(false);
	const lens = useLenses(item?._id)
	const narrow = !lens.some(l => l.FullWidthSelected)

	const ed = useItemEditor()

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
							selector={ l => l.AsSelected?.RenderHeader }
							props={{ itemId: item?._id, onClick: () => ed.open(item?._id) }} />
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

	const ed = useItemEditor()
	const { isMobile } = useWindowSize()

	return (
		<ItemEditorFrame canSave={ !!ed.item?.title } onDone={ props.onDone }>
			<>
				<TrText small faded>Description</TrText>
				<Bump h={ 5 } />
				<TextInput
					value={ ed.item?.description }
					multiline
					key='description'
					onKeyDown={ ed.handleKeyDown }
					onChange={ v => ed.updateItem({ description: v }) } 
					style={{ height: isMobile ? '50%' : 500, maxHeight: '50vh', padding: 15, borderRadius: 18, maxWidth: 800, fontWeight: 'normal' }}
					/>
			</>
		</ItemEditorFrame>
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