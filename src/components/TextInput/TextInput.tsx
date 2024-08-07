import classNames from "classnames";
import React, { FormEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
	onBlur?: (value: string) => void
	onKeyDown?: (event: InputEvent) => void
	clearOnEnter?: boolean
	style?: React.CSSProperties
	className?: string
	multiline?: boolean
	rows?: number
	secret?: boolean
}

export const TextInput = React.memo((props: TextInputProps) => {

	const {
		onBlur, onChange, onKeyDown, onEnter, clearOnEnter, large, small, darker, transparent, multiline, secret, style, rows,
		className
	} = props;
	const [ value, setValue ] = useState('')

	const elRef = useRef<HTMLTextAreaElement | HTMLInputElement>()

	useEffect(() => {
		if (props.value !== undefined) setValue(props.value)
	}, [ props.value ])

	const handleChange = useCallback((e: ChangeEvent) => {
		setValue(e.target.value)
		if (onChange) onChange(e.target.value)
	}, [ setValue ])

	const handleBlur = useCallback(() => { onBlur?.(value) }, [ value ])

	const handleKeyDown: FormEventHandler = useCallback((e: InputEvent) => {
		if (onKeyDown) onKeyDown(e)
		if (e.key === 'Enter') {
			if (onEnter) onEnter(value);
			if (clearOnEnter) setValue('');
		} else if (e.key === 'Escape') {
			elRef.current?.blur()
		}
	}, [ onEnter, value ])

	const classString = useMemo(() => classNames({
		'text-input': true,
		'text-input-large': large,
		'text-input-small': small,
		'text-input-normal': !small && !large && !transparent,
		'text-input-darker': darker,
		'text-input-transparent': transparent,
	}) + ' ' + className, [ large, small, darker, className ])

	if (multiline) return (
		<textarea ref={ elRef as any } rows={ rows || 10 } value={ value } onBlur={ handleBlur } onChange={ handleChange } onKeyDown={ handleKeyDown } className={ classString } style={ style }>
		</textarea>
	)

	return (
		<input ref={ elRef as any } type={ secret ? 'password' : 'type' } style={ style } className={ classString } onChange={ handleChange } value={ value } onKeyDown={ handleKeyDown } />
	)

})