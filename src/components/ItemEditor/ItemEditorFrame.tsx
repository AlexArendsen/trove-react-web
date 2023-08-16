import React from "react"
import { useItemEditor } from "../../stores/useItemEditor"
import { Button } from "../Button/Button"
import { Flex } from "../Flex/Flex"
import { TextInput } from "../TextInput/TextInput"
import { Bump } from "../Bump/Bump"
import { useWindowSize } from "../../hooks/UseWindowSize"
import { TrText } from "../Text/Text"

export const ItemEditorFrame = React.memo((props: {
	children: JSX.Element,
	canSave?: boolean,
	onDone?: () => void
}) => {

	const ed = useItemEditor()

	const { isMobile } = useWindowSize()

	const { onDone, canSave, children } = props

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
		<Flex column style={{ maxWidth: 800, paddingBottom: 20, flex: 1 }}>
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