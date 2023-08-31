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
import { LensConfiguration } from "../../components/ItemEditor/ItemEditorNewLensPage"

export const LayoutItemEditor = React.memo((props: {
    itemId: string,
    onDone: () => void,
    config: LensConfiguration
}) => {

    const ed = useItemEditor()
    const { config, itemId, onDone } = props
    const src = config.data?.['txml']

    console.log({ src, item: ed.item })

    const handleBlur = (value: string) => {
        if (!ed.item) return;
        ItemData.setLensData(ed.item, config.id, { txml: value })
        ed.updateItem(ed.item)
    }

    const { spec, error } = useMemo(() => {
        try { return { spec: Layout.Parse(src), error: null } }
        catch (e) { return { spec: null, error: (e as Error).message } }
    }, [ src ])

    return (
        <>
            <Flex column style={{ flex: 1 }}>
                <TrText small faded>Layout Spec (TXML)</TrText>
                <Bump h={ 5 } />
                <TextInput
                    multiline
                    value={ src }
                    onBlur={ handleBlur }
                    onKeyDown={ ed.handleKeyDown }
                    style={{ fontFamily: 'monospace', minHeight: 300 }} />
            </Flex>

            <Bump h={ 10 } />

            <Flex column style={{ flex: 1, overflow: 'scroll' }}>
                <TrText small faded>Preview</TrText>
                <Bump h={ 5 } />
                <LayoutView preview layout={ spec || undefined } />
            </Flex>

        </>
    )

})