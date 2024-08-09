import classNames from "classnames";
import React from "react";
import { TrText } from "../Text/Text";
import './Button.css';

export interface ButtonProps {
	variant?: 'submit' | 'danger' | 'accent' | 'primary'
	submitForm?: boolean
	fullWidth?: boolean
	onClick?: (e: React.MouseEvent) => void
	label?: string
	children?: any
	small?: boolean
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
				'button-primary': props.variant === 'primary',
				'button-full-width': props.fullWidth,
				'button-large': props.large,
				'button-small': props.small
			})}
			style={ props.style }>
			<TrText className={
				classNames({
					'button-label': true,
					'button-label-large': props.large,
					'button-label-submit': props.variant === 'submit',
					'button-label-primary': props.variant === 'primary'
				})
			}>{ props.label }</TrText>
			{ props.children }
		</button>
	)

})