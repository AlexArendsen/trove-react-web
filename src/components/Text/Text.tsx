import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Colors } from "../../constants/Colors";
import { uuid } from "../../utils/Uuid";

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

	// TODO - Switch to classes

	const fontWeight = useMemo(() => {
		switch (true) {
			case bold: return 700
			case light: return undefined
			default: return 400
		}
	}, [ bold, light ])

	const fontSize = useMemo(() => {
		switch (true) {
			case large: return 36
			case mediumLarge: return 24
			case medium: return 18
			default: return style?.fontWeight || 14
		}
	}, [ large, medium, small ])

	const color = useMemo(() => {
		switch (true) {
			case faded: return '#9A9A9A'
			case accent: return Colors.Accent1
			case white: return 'white'
			default: return undefined
		}
	}, [ large, medium, small ])

	const styles: React.CSSProperties = useMemo(() => ({ fontWeight, fontSize, color, ...style }), [ style, fontWeight, fontSize, color ]);

	// Editable stuff
	const key = useMemo(() => uuid(), [ ])
	const [ value, setValue ] = useState(children);
	useEffect(() => setValue(children), [ children ])
	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value);
		if (onChange) onChange(e.target.value)
	}, [ setValue ])
	const inputStyles = useMemo(() => ({ ...styles, fontFamily: 'unset', border: 0, padding: 0, outline: 0 }), [])

	if (editable) {
		if (multiline) return (
			<textarea key={ key } rows={ 6 } onChange={ handleChange } onKeyDown={ props.onKeyDown } style={ inputStyles } value={ value }>
			</textarea>
		); else return (
			<input key={ key } onChange={ handleChange } onKeyDown={ props.onKeyDown } value={ value } style={ inputStyles } />
		)
	}

	if (inline) return (
		<span onClick={ props.onClick } className={ className } style={ styles }>{ children }</span>
	)

	return (
		<div onClick={ props.onClick } className={ className } style={ styles }>{ children }</div>
	)


})

export const TrText = Text