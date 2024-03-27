import React, { useState } from "react";
import { Bump } from "../components/Bump/Bump";
import { Button } from "../components/Button/Button";
import { Flex } from "../components/Flex/Flex";
import { TrText } from "../components/Text/Text";
import { TextInput } from "../components/TextInput/TextInput";
import { ItemLens } from "./ItemLens";
import { useItem } from "../hooks/UseItem";

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
