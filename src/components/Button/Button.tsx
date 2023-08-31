import classNames from "classnames";
import React from "react";
import { Text } from "../Text/Text";
import './Button.css';

export interface ButtonProps {
	variant?: 'submit'
	submitForm?: boolean
	fullWidth?: boolean
	onClick?: (e: React.MouseEvent) => void
	children: string
	large?: boolean
	style?: React.CSSProperties
	textStyle?: React.CSSProperties
	disabled?: boolean
}

export const Button = React.memo((props: ButtonProps) => {

	return (
		<button
			type={ props.submitForm ? 'submit' : 'button' }
			disabled={ props.disabled }
			onClick={ props.onClick }
			className={classNames({
				'button': true,
				'button-submit': props.variant === 'submit',
				'button-full-width': props.fullWidth,
				'button-large': props.large
			})}
			style={ props.style }>
			<Text style={{ fontSize: props.large ? 20 : 14, fontWeight: 'bold' }}>{ props.children }</Text>
		</button>
	)

})