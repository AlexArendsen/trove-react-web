import React, { useMemo } from "react"
import { Flex } from "../../components/Flex/Flex"
import { LensConfiguration } from "../../components/ItemEditor/ItemEditorNewLensPage"
import { ItemList } from "../../components/ItemList/ItemList"
import { TrText } from "../../components/Text/Text"
import { useItem } from "../../hooks/UseItem"
import { Item } from "../../redux/models/Items/Item"
import { useItemStore } from "../../stores/ItemStore/useItemStore"
import { ItemData } from "../../utils/ItemData"
import { Layout, LayoutSpec } from "../../utils/Parsing/Layout"
import { TxmlAstNode } from "../../utils/Parsing/Txml"
import { QueryItems } from "../../utils/QueryItems"

type VariableLookup = { [name: string]: Item | Item[] | number }
const CELL_UNIT_SIZE = 100
const PREVIEW_CELL_UNIT_SIZE = 20

export const LayoutItemView = React.memo((props: {
    itemId: string,
    config: LensConfiguration
}) => {

    const { itemId, config } = props

    const { item } = useItem(itemId)

    const { txml } = ItemData.getLensData(item, config.id, { txml: '' })
    const { layout, error } = useMemo(() => {
        try {
            if (txml) return { layout: Layout.Parse(txml), error: '' }
            else return { layout: null, error: '' }
        } catch (e) {
            return { layout: null, error: (e as Error).message }
        }
    }, [ txml ])


    return (
        <div>
            { layout ? <LayoutView layout={ layout } /> : null }
            { error ? <div style={{ padding: 20, backgroundColor: '#efefef' }}><TrText medium bold>⚠ { error }</TrText></div> : null }
        </div>
    )


})

export const LayoutView = React.memo((props: {
    layout?: LayoutSpec,
    preview?: boolean
}) => {

    const { layout, preview } = props

    const vars: VariableLookup = useMemo(() => {
        const v = layout?.variables.reduce((lookup, v) => ({ ...lookup, [v.name]: QueryItems(v.path) }), {}) || {}
        console.log({ v })
        return v
    }, [ layout ])

    if (!layout) return null

    return <LayoutNodeInterpreter node={ layout.layout } context={ vars } preview={ preview } />

})

const LayoutNodeInterpreter = React.memo((props: {
    node: TxmlAstNode
    parent?: TxmlAstNode
    context: VariableLookup
    preview?: boolean
}) => {

    const { node, context, parent, preview } = props

    if (node.name === 'Row') return (
        <Flex row>
            { node.children?.map(c => <LayoutNodeInterpreter node={ c } parent={ node } context={ context } preview={ preview } />) }
        </Flex>
    )
    else if (node.name === 'Col') return (
        <Flex column>
            { node.children?.map(c => <LayoutNodeInterpreter node={ c } parent={ node } context={ context } preview={ preview } />) }
        </Flex>
    )
    else if (node.name === 'Box') return preview
        ? (<PreviewBox { ...node.attributes } context={ context } />)
        : (<Box { ...node.attributes } context={ context } />)
    else if (node.name === 'Boxes') return preview
        ? (<PreviewBoxes { ...node.attributes } orientation={ parent?.name === 'Row' ? 'row' : 'col' } context={ context } />)
        : (<Boxes { ...node.attributes } orientation={ parent?.name === 'Row' ? 'row' : 'col' } context={ context } />)
    else return (
        <div><TrText bold style={{ color: 'red' }}>Unrecognized node { node.name }</TrText></div>
    )


})

const PreviewBox = React.memo((props: any) => {

    const { single, items, width, height } = useBoxProps(props)

    const label = single ? items[0]?.title : (props.item || props.items)

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: width * PREVIEW_CELL_UNIT_SIZE,
            height: height * PREVIEW_CELL_UNIT_SIZE,
            border: 'solid 1px #eee',
            margin: 2,
            boxSizing: 'border-box',
            borderRadius: 10,
            boxShadow: '0 0 6 rgba(0,0,0,0.1)',
            overflow: 'hidden'
        }}>
            <TrText small faded style={{ textAlign: 'center' }}>{ label }</TrText>
        </div>
    )

})

const Box = React.memo((props: any) => {

    const { single, items, width, height } = useBoxProps(props)
    const children = useItemStore(s => {
        if (!single) return []
        const first = items?.[0]
        if (!first) return []
        return s.byParent[first._id]
    })

    return (
        <div style={{
            width: width * CELL_UNIT_SIZE,
            height: height * CELL_UNIT_SIZE,
            border: 'solid 1px #eee',
            margin: 4,
            boxSizing: 'border-box',
            borderRadius: 30,
            boxShadow: '0 0 6 rgba(0,0,0,0.1)',
            overflow: 'scroll'
        }}>
            { single ? (
                <ItemList items={ children } />
            ) : (
                <ItemList items={ items } />
            ) }
        </div>
    )

})

const PreviewBoxes = React.memo((props: any) => {

    const { items, orientation, context } = useBoxProps(props)

    return (
        <Flex column={ orientation === 'col' } row={ orientation === 'row' } >
            { items.map(i => <PreviewBox { ...props } _item={i} context={ context } />) }
        </Flex>
    )

})

const Boxes = React.memo((props: any) => {

    const { items, orientation, context } = useBoxProps(props)

    return (
        <Flex column={ orientation === 'col' } row={ orientation === 'row' } >
            { items.map(i => <Box { ...props } _item={i} context={ context } />) }
        </Flex>
    )

})

const useBoxProps = (props: any): {
    single: boolean
    items: Item[]
    orientation: 'row' | 'col'
    width: number
    height: number
    context: VariableLookup
} => {

    const { item, items, width, height, orientation } = props as Record<string, string>
    const realItem = props._item as Item
    const context = props.context as VariableLookup
    const i = castItemList(context[item || items])
    const w = parseInt(width)
    const h = parseInt(height)

    return {
        single: !!realItem || i.length === 1,
        items: realItem ? [realItem] : i,
        orientation: orientation === 'row' ? 'row' : 'col',
        width: w,
        height: h,
        context
    }
 

}

// TODO -- Move this to some kind of ItemQueryResult helper
const castItemList = (i: Item | Item[] | number) => {
    if (typeof i === 'number') return []
    else if (Array.isArray(i)) return i
    else return [i]
}