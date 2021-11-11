import classNames from "classnames";
import React, { FormEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import './TextInput.css';

type InputEvent = React.KeyboardEvent<HTMLInputElement> & React.KeyboardEvent<HTMLTextAreaElement>;
type ChangeEvent = React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>;

interface TextInputProps {
	placeholder?: string
	value?: string
	large?: boolean
	small?: boolean
	transparent?: boolean
	darker?: boolean
	onChange?: (value: string) => void
	onEnter?: (value: string) => void
	onKeyDown?: (event: InputEvent) => void
	clearOnEnter?: boolean
	style?: React.CSSProperties
	multiline?: boolean
	secret?: boolean
}

export const TextInput = React.memo((props: TextInputProps) => {

	const [ value, setValue ] = useState('')

	useEffect(() => {
		if (props.value !== undefined) setValue(props.value)
	}, [ props.value ])

	const handleChange = useCallback((e: ChangeEvent) => {
		setValue(e.target.value)
		if (props.onChange) props.onChange(e.target.value)
	}, [ setValue ])

	const handleKeyDown: FormEventHandler = useCallback((e: InputEvent) => {
		if (props.onKeyDown) props.onKeyDown(e)
		if (e.key === 'Enter') {
			if (props.onEnter) props.onEnter(value);
			if (props.clearOnEnter) setValue('');
		}
	}, [ props.onEnter, value ])

	const classString = useMemo(() => classNames({
		'text-input': true,
		'text-input-large': props.large,
		'text-input-small': props.small,
		'text-input-normal': !props.small && !props.large && !props.transparent,
		'text-input-darker': props.darker,
		'text-input-transparent': props.transparent,
	}), [ props.large, props.small, props.darker ])

	if (props.multiline) return (
		<textarea rows={ 10 } value={ value } onChange={ handleChange } onKeyDown={ handleKeyDown } className={ classString } style={ props.style }>
		</textarea>
	)

	return (
		<input type={ props.secret ? 'password' : 'type' } style={ props.style } className={ classString } onChange={ handleChange } value={ value } onKeyDown={ handleKeyDown } />
	)

})