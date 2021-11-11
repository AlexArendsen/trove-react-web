import classNames from "classnames";
import React from "react";
import { Text } from "../Text/Text";
import './Button.css';

interface ButtonProps {
	variant?: 'submit'
	submitForm?: boolean
	fullWidth?: boolean
	onClick?: (e: React.MouseEvent) => void
	children: string
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
				'button-full-width': props.fullWidth
			})}
			style={ props.style }>
			<Text style={{ fontSize: 12 }}>{ props.children }</Text>
		</button>
	)

})