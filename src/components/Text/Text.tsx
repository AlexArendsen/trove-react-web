import React, { useCallback, useEffect, useMemo, useState } from "react";
import { uuid } from "../../utils/Uuid";
import './Text.css';
import classNames from "classnames";

interface TextProps {
	// Weight
	light?: boolean
	bold?: boolean

	// Size
	large?: boolean
	mediumLarge?: boolean
	medium?: boolean
	small?: boolean

	// Color
	faded?: boolean
	accent?: boolean
	white?: boolean

	inline?: boolean
	style?: React.CSSProperties
	className?: string

	editable?: boolean
	multiline?: boolean
	onChange?: (value: string) => void
	onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement> & React.KeyboardEvent<HTMLTextAreaElement>) => void

	onClick?: () => void
	children?: any
}

/**@deprecated Please use TrText */
export const Text = React.memo((props: TextProps) => {

	const {
		bold, light,
		large, mediumLarge, medium, small,
		faded, accent, white,
		inline,
		editable, multiline, onChange,
		style, className, children
	} = props

	const styleClassNames = classNames({
		'trtext': true,
		'trtext-bold': bold,
		'trtext-light': light,
		'trtext-large': large,
		'trtext-medium-large': mediumLarge,
		'trtext-medium': medium,
		'trtext-small': small,
		'trtext-faded': faded,
		'trtext-accent': accent,
		'trtext-inverse': white
	})
	const classString = `${className} ${styleClassNames}`;

	//const styles: React.CSSProperties = useMemo(() => ({ fontWeight, fontSize, color, ...style }), [ style, fontWeight, fontSize, color ]);

	// Editable stuff
	const key = useMemo(() => uuid(), [ ])
	const [ value, setValue ] = useState(children);
	useEffect(() => setValue(children), [ children ])
	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value);
		if (onChange) onChange(e.target.value)
	}, [ setValue ])
	const inputStyles = useMemo(() => ({ ...style, fontFamily: 'unset', border: 0, padding: 0, outline: 0 }), [])

	if (editable) {
		if (multiline) return (
			<textarea key={ key } rows={ 6 } onChange={ handleChange } className={ styleClassNames } onKeyDown={ props.onKeyDown } style={ inputStyles } value={ value }>
			</textarea>
		); else return (
			<input key={ key } onChange={ handleChange } onKeyDown={ props.onKeyDown } className={ styleClassNames } value={ value } style={ inputStyles } />
		)
	}

	if (inline) return (
		<span onClick={ props.onClick } className={ classString } style={ style }>{ children }</span>
	)

	return (
		<div onClick={ props.onClick } className={ classString } style={ style }>{ children }</div>
	)


})

export const TrText = Text