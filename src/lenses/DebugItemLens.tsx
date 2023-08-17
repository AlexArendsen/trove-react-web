import React, { useEffect, useMemo, useState } from "react";
import { Bump } from "../components/Bump/Bump";
import { Flex } from "../components/Flex/Flex";
import { TrText } from "../components/Text/Text";
import { TextInput } from "../components/TextInput/TextInput";
import { PathAstNode } from "../utils/Parsing/Path";
import { SplitAstNode, SplitSideAstNode } from "../utils/Parsing/Split";
import { ItemLens } from "./ItemLens";
import { Txml, TxmlAstNode } from "../utils/Parsing/Txml";
import { Layout, LayoutSpec } from "../utils/Parsing/Layout";
import { Item } from "../redux/models/Items/Item";
import { QueryItems } from "../utils/QueryItems";
import { ItemList } from "../components/ItemList/ItemList";
import { SelectedItemDisplay } from "../screens/ItemsScreen/SelectedItemDisplay/SelectedItemDisplay";
import { GetFromStore } from "../utils/GetFromStore";
import { useStore } from "../hooks/UseStore";
import { useItem } from "../hooks/UseItem";
import { Button } from "../components/Button/Button";
import { useDispatch } from "react-redux";
import { UpdateOneItemAction } from "../redux/actions/ItemActions";
import { ItemData } from "../utils/ItemData";
import { useItemEditor } from "../stores/useItemEditor";
import { ItemEditorFrame } from "../components/ItemEditor/ItemEditorFrame";
import { useWindowSize } from "../hooks/UseWindowSize";

export const DebugItemLens: ItemLens = {

    Name: 'DebugItemLens',
    Test: i => /^#debug/.test(i.description || ''),

    Self: {
        AsSelected: {
            RenderNewItemInputForm: () => null,
            RenderEditor: (props) => <LayoutItemEditor { ...props } />,
            RenderChildList: (props) => <DebugChildList { ...props } />
        },
        FullWidthSelected: true
    }

}

const DescribePathNode = (n: PathAstNode) => {
    switch (n.type) {
        case 'literal': return `Go to the child item labeled "${n.literal}"`
        case 'pattern': return `Select all children matching pattern "${n.regex}"`
    }
}

const DescribeSplitSide = (n: SplitSideAstNode): string => {
    if (n.type === 'path' && n.path) return `a list of items formed by the following procedure (${ n.path.map(DescribePathNode).join(';') })`
    else if (n.type === 'subtree' && !! n.subtree) return `a subtree formed by the following procedure (${ DescribeSplit(n.subtree) })`
    return 'nothing, because there was a problem parsing the split spec'
}

const DescribeSplit = (n?: SplitAstNode): string => {
    if (!n) return 'Parsing problem, no split is shown'
    if (n.orientation === 'horizontal') {
        return `Split the screen down the middle, into left and right panes. On the right is ${ DescribeSplitSide(n.item1) }. On the left is ${ DescribeSplitSide(n.item2) }`
    } else {
        return `Split the screen from left to right, into upper and lower panes. On top is ${ DescribeSplitSide(n.item1) }. On the bottom is ${ DescribeSplitSide(n.item2) }`
    }
}

const DebugChildList = React.memo((props: {
    itemId: string
}) => {

    const { itemId } = props

    const { item } = useItem(itemId)

    const txml = item?.data?.['_layout']
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

// TODO -- Move to LayoutItemEditor

const LayoutItemEditor = React.memo((props: {
    itemId: string,
    onDone: () => void,
}) => {

    const ed = useItemEditor()
    const src = ItemData.get(ed.item, '_layout', '')

    console.log({ src, item: ed.item })

    const handleBlur = (value: string) => {
        if (!ed.item) return;
        ItemData.set(ed.item, '_layout', value)
        ed.updateItem(ed.item)
    }

    const { spec, error } = useMemo(() => {
        try { return { spec: Layout.Parse(src), error: null } }
        catch (e) { return { spec: null, error: (e as Error).message } }
    }, [ src ])

    return (
        <ItemEditorFrame>
            <>
                <Flex column style={{ flex: 1, overflow: 'scroll' }}>
                    <TrText small faded>Preview</TrText>
                    <Bump h={ 5 } />
                    <LayoutView preview layout={ spec || undefined } />
                </Flex>

                <Bump h={ 10 } />

                <Flex column style={{ flex: 1 }}>
                    <TrText small faded>Layout Spec</TrText>
                    <Bump h={ 5 } />
                    <TextInput
                        multiline
                        value={ src }
                        onBlur={ handleBlur }
                        onKeyDown={ ed.handleKeyDown }
                        style={{ fontFamily: 'monospace', minHeight: 300 }} />
                </Flex>

                <Bump h={ 10 } />

                <Flex column style={{ flex: 1 }}>
                    <TrText small faded>Description</TrText>
                    <Bump h={ 5 } />
                    <TextInput
                        multiline
                        value={ ed.item?.description }
                        onKeyDown={ ed.handleKeyDown }
                        onBlur={ v => ed.updateItem({ description: v }) } />
                </Flex>
            </>
        </ItemEditorFrame>
    )

})


// TODO -- Move to LayoutView.tsx

type VariableLookup = { [name: string]: Item | Item[] | number }
const CELL_UNIT_SIZE = 100
const PREVIEW_CELL_UNIT_SIZE = 20

const LayoutView = React.memo((props: {
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
    const children = useStore(s => {
        if (!single) return []
        const first = items?.[0]
        if (!first) return []
        return s.items.byParent[first._id]
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
