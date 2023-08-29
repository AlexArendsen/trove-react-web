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

export const ItemEditorFrame = React.memo((props: {
	children: JSX.Element,
	canSave?: boolean,
	onDone?: () => void,
	selectedLens?: string | null
	onSelectLens?: (lens: string) => void
}) => {

	const ed = useItemEditor()

	const { isMobile } = useWindowSize()

	const { onDone, canSave, children, selectedLens, onSelectLens } = props

	const lenses = useMemo(() => {
		const fromItem = ItemData.get<LensConfiguration[]>(ed.item, '__lenses', [])
			.map(c => ({ label: c.title, value: c.id }));
		return [ { label: 'General', value: null }, ...fromItem, { label: '+', value: '%ADD' } ]
	}, [ ed.item ])

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
			<PillList options={ lenses } onClick={ l => onSelectLens?.(l) } selected={ selectedLens } />
			<Bump h={ 20 } />
			<div style={{ flex: 1 }}>
				{ children }
			</div>
			<Bump h={ 20 } />
			<Flex row={ !isMobile } column={ isMobile } align={ isMobile ? 'stretch' : 'center' }>
				<Button onClick={ handleDelete } style={{ color: 'red', backgroundColor: '#ff000033' }}>
					Delete
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