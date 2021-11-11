import classNames from "classnames";
import React from "react";
import { Text } from "../Text/Text";
import './Logo.css'

interface LogoProps {
	variant?: 'white' | 'gradient',
	large?: boolean
}

export const Logo = React.memo((props: LogoProps) => {

	const { variant, large } = props

	return (
		<Text large bold className={classNames({
			'trove-logo': true,
			'trove-logo-large': large,
			'trove-logo-small': !large,
			'trove-logo-white': variant === 'white',
			'trove-logo-black': !variant,
			'trove-logo-gradient': variant === 'gradient'
		})}>Trove</Text>
	)

})