import React, { Dispatch, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { AddItemAction } from "../../redux/actions/ItemActions";
import { Button } from "../Button/Button";
import { Flex } from "../Flex/Flex";
import { TextInput } from "../TextInput/TextInput";
import { History as DomHistory } from 'history';
import { NewItem } from "../../utils/Parsing/NewItem";
import { useItemStore } from "../../stores/ItemStore/useItemStore";

interface ItemInputFormProps {
	itemId?: string,
	style?: React.CSSProperties,
	darker?: boolean,
	smaller?: boolean,
	/**@deprecated */ onSubmitOverride?: (dispatch: Dispatch<any>, history: DomHistory, title: string) => void
}

export const ItemInputForm = React.memo((props: ItemInputFormProps) => {

	const { itemId, style, darker, smaller, onSubmitOverride } = props
	const dispatch = useDispatch();
	const [ title, setTitle ] = useState('')
	const history = useHistory();

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault();
		if (onSubmitOverride) onSubmitOverride(dispatch, history, title)
		const parsed = NewItem.Parse(title)
		if (itemId) useItemStore.getState().create(title, itemId, parsed)
		setTitle('')
	}, [ title, history, dispatch, onSubmitOverride ])

	return (
		<form onSubmit={ handleSubmit } style={{ width: '100%', maxWidth: 800, ...style }}>
			<Flex row>
				<TextInput small={ smaller } key='title-input' darker={ darker } onChange={ setTitle } value={ title } />
				<Button variant='submit' style={{ marginLeft: 15 }} submitForm label='Add' />
			</Flex>
		</form>
	)

})