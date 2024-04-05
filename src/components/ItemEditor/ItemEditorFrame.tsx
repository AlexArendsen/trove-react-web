import React, { useEffect } from "react"
import { useWindowSize } from "../../hooks/UseWindowSize"
import { ItemLensPillList } from "../../lenses/Shared/ItemLensPillLIst"
import { useItemEditor } from "../../stores/useItemEditor"
import { useMoveEditor } from "../../stores/useMoveEditor"
import { Bump } from "../Bump/Bump"
import { Button } from "../Button/Button"
import { Flex } from "../Flex/Flex"
import { TrText } from "../Text/Text"
import { LensConfiguration } from "./ItemEditorNewLensPage"

export const ItemEditorFrame = React.memo((props: {
	children: JSX.Element,
	canSave?: boolean,
	onDone?: () => void,
	selectedLens?: string | null
	onSelectLens?: (lens: string) => void
}) => {

	const ed = useItemEditor()
	const move = useMoveEditor()

	const { isMobile } = useWindowSize()

	const { onDone, canSave, children, selectedLens, onSelectLens } = props

	const handleDeleteLens = (lensId: string) => {
		const filteredLenses = (ed.item?.data?.__lenses as LensConfiguration[])?.filter(c => c.id !== lensId)
		const updatedData = { ...ed.item?.data, __lenses: filteredLenses }
		ed.updateItem({ data: updatedData })
	}

	const handleKeyEvent = (e: KeyboardEvent) => {
		if (e.target !== document.body) return; // These shortcuts only apply if you aren't typing somewhere

		if(e.key === 'Delete') {
			// TODO -- require second press to confirm
			ed.delete()
			handleDone()
		} else if (e.key === 'Escape')  {
			// TODO -- check if you haven't changed anything, will need to take lenses into account
			ed.close()
		}
	}

	useEffect(() => {
		const h = (e: KeyboardEvent) => handleKeyEvent(e)
		document.addEventListener('keydown', h)
		return () => document.removeEventListener('keydown', h)
	}, [])

    const handleDone = () => {
        onDone?.()
        ed.close()
    }

    const handleSave = () => {
        ed.save()
        handleDone()
    }

	const handleDelete = () => {
		ed.delete()
		handleDone()
	}

	return (
		<Flex column style={{ maxWidth: 800, paddingBottom: isMobile ? 0 : 20, flex: 1 }}>
			<div style={{ margin: '0 -30px' }}>
				<ItemLensPillList item={ ed.item }
					onClick={ (l: string) => onSelectLens?.(l) }
					selected={ selectedLens }
					startOffset={ 30 } endOffset={ 100 }
					onDelete={ handleDeleteLens }
					includeAdd />
			</div>
			<Bump h={ 20 } />
			<div style={{ flex: 1 }}>
				{ children }
			</div>
			<Bump h={ 20 } />
			<Flex row={ !isMobile } column={ isMobile } align={ isMobile ? 'stretch' : 'center' }>
				{ ed.item?.isRoot ? null : <Button onClick={ handleDelete } style={{ color: 'red', backgroundColor: '#ff000033' }} label='Delete' /> }
				<Bump w={ 20 } h={ 10 } />
				{ ed.item?.isRoot ? null : <Button onClick={ () => move.open(ed.item?._id || '') } label='Move' /> }
				<div style={{ flex: 1 }}></div>
				{ isMobile ? null : <TrText small faded>Ctrl+Enter</TrText> }
				<Bump w={ 20 } h={ 10 } />
				<Button variant='submit' disabled={ canSave === false } onClick={ handleSave } label='Save Changes' />
				<Bump w={ 20 } h={ 10 } />
				<Button onClick={ handleDone } label='Cancel' />
			</Flex>
		</Flex>
	)
})