import React, { useMemo } from "react";

interface FlexProps {
	justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around',
	align?: 'flex-start' | 'flex-end' | 'center' | 'stretch',
	className?: string
	style?: React.CSSProperties
	wrap?: boolean
	center?: boolean
	row?: boolean
	column?: boolean
	children?: any
	ref?: React.LegacyRef<HTMLDivElement>
	onClick?: () => void
	onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Flex = React.memo((props: FlexProps) => {

	const styles: React.CSSProperties = useMemo(() => ({
		display: 'flex',
		flexWrap: props.wrap ? 'wrap' : undefined,
		flexDirection: props.column ? 'column' : 'row',
		justifyContent: props.center ? 'center' : (props.justify || undefined),
		alignItems: props.center ? 'center' : (props.align || undefined),
		...props.style
	}), [ props ])

	return (<div style={ styles } ref={ props.ref } className={ props.className } onClick={ props.onClick } onContextMenu={ props.onContextMenu }> { props.children } </div>)


})