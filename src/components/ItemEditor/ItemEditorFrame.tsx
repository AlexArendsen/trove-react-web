import React, { useEffect, useMemo, useState } from "react"
import { useItemEditor } from "../../stores/useItemEditor"
import { Button } from "../Button/Button"
import { Flex } from "../Flex/Flex"
import { TextInput } from "../TextInput/TextInput"
import { Bump } from "../Bump/Bump"
import { useWindowSize } from "../../hooks/UseWindowSize"
import { TrText } from "../Text/Text"
import { ItemData } from "../../utils/ItemData"
import { LensConfiguration } from "./ItemEditorNewLensPage"
import { PillList } from "../PillList/PillList"
import { ItemLensPillList } from "../../lenses/Shared/ItemLensPillLIst"
import { useMoveEditor } from "../../stores/useMoveEditor"

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
				<Button onClick={ handleDelete } style={{ color: 'red', backgroundColor: '#ff000033' }}>
					Delete
				</Button>
				<Bump w={ 20 } h={ 10 } />
				<Button onClick={ () => move.open(ed.item?._id || '') }>
					Move
				</Button>
				<div style={{ flex: 1 }}></div>
				{ isMobile ? null : <TrText small faded>Ctrl+Enter</TrText> }
				<Bump w={ 20 } h={ 10 } />
				<Button variant='submit' disabled={ canSave === false } onClick={ handleSave }>
					Save Changes
				</Button>
				<Bump w={ 20 } h={ 10 } />
				<Button onClick={ handleDone }>
					Cancel
				</Button>
			</Flex>
		</Flex>
	)
})