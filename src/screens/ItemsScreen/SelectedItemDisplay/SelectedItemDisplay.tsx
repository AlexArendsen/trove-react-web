import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { Bump } from "../../../components/Bump/Bump";
import { Flex } from "../../../components/Flex/Flex";
import { LensConfiguration } from "../../../components/ItemEditor/ItemEditorNewLensPage";
import { Markdown } from "../../../components/Markdown/Markdown";
import { PillList } from "../../../components/PillList/PillList";
import { ProgressBar } from "../../../components/ProgressBar/ProgressBar";
import { Text, TrText } from "../../../components/Text/Text";
import { TextInput } from "../../../components/TextInput/TextInput";
import { TimeDisplay } from "../../../components/TimeDisplay/TimeDisplay";
import { useItem } from "../../../hooks/UseItem";
import { allLenses } from "../../../hooks/UseItemLens";
import { useSelectedItem } from "../../../hooks/UseSelectedItem";
import { useWindowSize } from "../../../hooks/UseWindowSize";
import { LensedComponent } from "../../../lenses/LensedComponent";
import { useItemEditor } from "../../../stores/useItemEditor";
import { ItemData } from "../../../utils/ItemData";
import './SelectedItemDisplay.css';
import { DefaultItemLens } from "../../../lenses/DefaultItemLens";
import { ItemLensPillList } from "../../../lenses/Shared/ItemLensPillLIst";

export const SelectedItemDisplay = React.memo(() => {

	const { item, parent, grandparent } = useSelectedItem();
	const { isMobile } = useWindowSize()

	const [ lensId, setLensId ] = useState<string | null>(null)
	const { selectedLens, anyLenses, lensConfig } = useMemo(() => {
		const lenses = ItemData.get<LensConfiguration[]>(item, '__lenses', [])
		const lensConfig = lenses.find(l => l.id === lensId)
		const selectedLens = allLenses.find(l => lensConfig?.type === l.TypeId)?.Self || DefaultItemLens.Default
		return { selectedLens, anyLenses: lenses.length, lensConfig }
	}, [ lensId, item ])

	const narrow = !selectedLens?.FullWidthSelected;

	const ed = useItemEditor()

	useEffect(() => {
		setLensId(ItemData.getItemLocalMemo(item, 'default-lens') || null)
	}, [ item ])

	const handleSelectLens = (id: string) => {
		setLensId(id)
		ItemData.setItemLocalMemo(item, 'default-lens', id)
	}

	const paddingTop = useMemo(() => {
		if (isMobile) return 20
		if (anyLenses) return 40
		return 60
	}, [ isMobile, anyLenses ])

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

	const contentWrapperClasses = classNames({
		'selected-item-display-content-wrapper': true,
		'selected-item-display-content-wrapper-lenses': anyLenses
	})

	return (
		<Flex column className={ displayClasses }>

			<ProgressBar item={ item } />

			{ anyLenses ? (
				<>
					<Bump h={ 10 } />
					<ItemLensPillList item={ item } onClick={ handleSelectLens } selected={ lensId } startOffset={ 10 } generalLensLabel='Default' />
					<Bump h={ 10 } />
				</>
			) : null }

			<Flex column align='center' className={ contentWrapperClasses } style={{ paddingTop }}>
				<Flex column className={ contentClasses }>
					<div style={{ margin: '0 20px' }}>
						<LensedComponent lens={ selectedLens }
							selector={ l => l.AsSelected?.RenderHeader }
							props={{ itemId: item?._id, onClick: () => ed.open(item?._id), config: lensConfig }} />
						<LensedComponent lens={ selectedLens } selector={ l => l.AsSelected?.RenderNewItemInputForm } props={{ itemId: item?._id, config: lensConfig }} />
					</div>
					<div className={ classNames({
						'selected-item-children': true
					}) }>
						<LensedComponent lens={ selectedLens } selector={ l => l.AsSelected?.RenderChildList } props={{ itemId: item?._id, config: lensConfig }} />
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
		<Flex column>
			<TrText small faded>Title</TrText>
			<Bump h={ 5 } />
			<TextInput
				value={ ed.item?.title }
				style={{ fontSize: 24, fontWeight: 700, marginTop: 1 }}
				key='title'
				onKeyDown={ ed.handleKeyDown }
				onChange={ v => ed.updateItem({ title: v }) }
				/>
			<Bump h={ 20 } />
			<TrText small faded>Description</TrText>
			<Bump h={ 5 } />
			<TextInput
				value={ ed.item?.description }
				multiline
				key='description'
				onKeyDown={ ed.handleKeyDown }
				onChange={ v => ed.updateItem({ description: v }) } 
				style={{ height: isMobile ? '50%' : 400, maxHeight: '50vh', padding: 15, borderRadius: 18, maxWidth: 800, fontWeight: 'normal' }}
				/>
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