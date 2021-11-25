import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { AddItemAction } from "../../redux/actions/ItemActions";
import { Button } from "../Button/Button";
import { Flex } from "../Flex/Flex";
import { TextInput } from "../TextInput/TextInput";

interface ItemInputFormProps {
	itemId?: string,
	style?: React.CSSProperties,
	darker?: boolean
}

export const ItemInputForm = React.memo((props: ItemInputFormProps) => {

	const dispatch = useDispatch();
	const [ title, setTitle ] = useState('')

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault();
		console.info({ me: 'handleSubmit', title })
		if (props.itemId) dispatch(AddItemAction(title, props.itemId))
		setTitle('')
	}, [ title ])

	return (
		<form onSubmit={ handleSubmit } style={{ width: '100%', ...props.style }}>
			<Flex row>
				<TextInput key='title-input' darker={ props.darker } onChange={ setTitle } value={ title } />
				<Button variant='submit' style={{ marginLeft: 15 }} submitForm>Add</Button>
			</Flex>
		</form>
	)

})