import classNames from "classnames";
import React from "react";
import { TrText } from "../Text/Text";
import './Button.css';

export interface ButtonProps {
	variant?: 'submit' | 'danger' | 'accent'
	submitForm?: boolean
	fullWidth?: boolean
	onClick?: (e: React.MouseEvent) => void
	label?: string
	children?: any
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
				'button-accent': props.variant === 'accent',
				'button-submit': props.variant === 'submit',
				'button-danger': props.variant === 'danger',
				'button-full-width': props.fullWidth,
				'button-large': props.large
			})}
			style={ props.style }>
			<TrText white={ props.variant === 'submit' } style={{ fontSize: props.large ? 20 : 14, fontWeight: 'bold' }}>{ props.label }</TrText>
			{ props.children }
		</button>
	)

})