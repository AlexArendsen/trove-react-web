import React, { useMemo } from "react"
import { ItemLensItemSpec } from "./ItemLens"
import { DefaultItemLens } from "./DefaultItemLens"

const noop = (props: any) => null
export const LensedComponent = React.memo((props: {
	itemId?: string // TODO - When you do default lenses, bring this back, selected default lens
	lens?: ItemLensItemSpec,
	selector: (l: ItemLensItemSpec) => ((props: any) => JSX.Element | null) | undefined
	props: any
}) => {

	const { selector, lens } = props

	const Content: ((props: any) => JSX.Element | null) = useMemo(() => {
		return selector(lens || DefaultItemLens.Default!) || selector(DefaultItemLens.Default!) || noop
	}, [ lens, selector, props ])

	return <Content {...props.props} />
})