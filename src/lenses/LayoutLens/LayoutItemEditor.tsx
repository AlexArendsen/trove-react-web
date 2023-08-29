import React, { useMemo } from "react"
import { Bump } from "../../components/Bump/Bump"
import { Flex } from "../../components/Flex/Flex"
import { ItemEditorFrame } from "../../components/ItemEditor/ItemEditorFrame"
import { TrText } from "../../components/Text/Text"
import { TextInput } from "../../components/TextInput/TextInput"
import { useItemEditor } from "../../stores/useItemEditor"
import { ItemData } from "../../utils/ItemData"
import { Layout } from "../../utils/Parsing/Layout"
import { LayoutView } from "./LayoutView"

export const LayoutItemEditor = React.memo((props: {
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
    )

})