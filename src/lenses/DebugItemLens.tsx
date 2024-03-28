import React from "react";
import { useItem } from "../hooks/UseItem";
import { ItemLens } from "./ItemLens";

export const DebugItemLens: ItemLens = {

    Name: 'DebugItemLens',
    TypeId: 'debug',
    Test: i => /^#debug/.test(i.description || ''),

    Self: {
        AsSelected: {
            RenderNewItemInputForm: () => null,
            RenderChildList: (props) => <DebugItemList { ...props } />
        },
        FullWidthSelected: true
    }

}

const SPARS = 50
const DebugItemList = React.memo((props: {
    itemId: string
}) => {


    const { item } = useItem(props.itemId)

    return (
        <div style={{ margin: 20 }}>
            <pre>
                { JSON.stringify(item, undefined, '    ') }
            </pre>
        </div>
    )

})
