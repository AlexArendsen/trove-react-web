import React, { useMemo } from "react"
import { useLenses } from "../hooks/UseItemLens"
import { ItemLensItemSpec } from "./ItemLens"

const noop = (props: any) => null
export const LensedComponent = React.memo((props: {
	itemId: string,
	selector: (l: ItemLensItemSpec) => ((props: any) => JSX.Element) | undefined
	props: any
}) => {

	const { itemId, selector } = props
	const lenses = useLenses(itemId)

	const Content: ((props: any) => JSX.Element | null) = useMemo(() => {
		const match = lenses.find(l => !!selector(l))
		return match ? selector(match) || noop : noop
	}, [ lenses, selector, props ])

	return <Content {...props.props} />
})