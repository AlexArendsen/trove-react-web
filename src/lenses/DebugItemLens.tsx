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
    }, txml)


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
    const { itemId, onDone } = props

    const [ src, setSrc ] = useState<string>()
    useEffect(() => {
        setSrc(ed.item?.data?.['_layout'])
    }, [ ed.item ])

    const handleBlur = () => {
        if (!ed.item) return;
        ItemData.set(ed.item, '_layout', src)
        ed.updateItem(ed.item)
    }

    const { spec, error } = useMemo(() => {
        try { return { spec: Layout.Parse(ItemData.get(ed.item, '_layout', '')), error: null } }
        catch (e) { return { spec: null, error: (e as Error).message } }
    }, [ src ])

    return (
        <ItemEditorFrame>
            <TextInput multiline rows={ 30 }
                value={ src } onChange={ setSrc }
                onBlur={ handleBlur }
                style={{ fontFamily: 'monospace' }} />
        </ItemEditorFrame>
    )

})


// TODO -- Move to LayoutView.tsx

type VariableLookup = { [name: string]: Item | Item[] | number }
const CELL_UNIT_SIZE = 100

const LayoutView = React.memo((props: {
    layout?: LayoutSpec
}) => {

    const { layout } = props

    const vars: VariableLookup = useMemo(() => {
        const v = layout?.variables.reduce((lookup, v) => ({ ...lookup, [v.name]: QueryItems(v.path) }), {}) || {}
        console.log({ v })
        return v
    }, [ layout ])

    if (!layout) return null

    return <LayoutNodeInterpreter node={ layout.layout } context={ vars } />

})

const LayoutNodeInterpreter = React.memo((props: {
    node: TxmlAstNode
    parent?: TxmlAstNode
    context: VariableLookup
}) => {

    const { node, context, parent } = props

    if (node.name === 'Row') return (
        <Flex row>
            { node.children?.map(c => <LayoutNodeInterpreter node={ c } parent={ node } context={ context } />) }
        </Flex>
    )
    else if (node.name === 'Col') return (
        <Flex column>
            { node.children?.map(c => <LayoutNodeInterpreter node={ c } parent={ node } context={ context } />) }
        </Flex>
    )
    else if (node.name === 'Box') return (
        <Box { ...node.attributes } context={ context } />
    )
    else if (node.name === 'Boxes') return (
        <Boxes { ...node.attributes } orientation={ parent?.name === 'Row' ? 'row' : 'col' } context={ context } />
    )
    else return (
        <div><TrText bold style={{ color: 'red' }}>Unrecognized node { node.name }</TrText></div>
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

const Boxes = React.memo((props: any) => {

    const { items, orientation, context } = useBoxProps(props)

    return (
        <Flex column={ orientation === 'col' } row={ orientation === 'row' } >
            { items.map(i => <Box { ...props } items={[i]} context={ context } />) }
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
    const context = props.context as VariableLookup
    const i = castItemList(context[item || items])
    const w = parseInt(width)
    const h = parseInt(height)

    return {
        single: i.length === 1,
        items: i,
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
