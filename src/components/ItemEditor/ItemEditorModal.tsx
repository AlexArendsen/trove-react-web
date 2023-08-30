import React, { useEffect, useMemo, useState } from "react";
import { allLenses } from "../../hooks/UseItemLens";
import { useItemEditor } from "../../stores/useItemEditor";
import { ModalPopover } from "../Popover/ModalPopover";
import { ItemEditorFrame } from "./ItemEditorFrame";
import { ItemEditorNewLensPage, LensConfiguration } from "./ItemEditorNewLensPage";
import { DefaultItemLens } from "../../lenses/DefaultItemLens";
import { TrText } from "../Text/Text";
import { ItemData } from "../../utils/ItemData";

const noop = () => (<p>NOTHING</p>)
export const ItemEditorModal = React.memo(() => {

    const ed = useItemEditor()
    const itemId = ed.item?._id || ''

    const [ lensId, setLensId ] = useState<string | null>(null)
    const configuredLenses = ItemData.get<LensConfiguration[]>(ed.item, '__lenses', [])
    const targetConfig = configuredLenses.find(l => l.id === lensId)
	const Content: ((props: any) => JSX.Element | null) = useMemo(() => {
        if (lensId === '%ADD') return ItemEditorNewLensPage
        if (!lensId) return DefaultItemLens.Default?.AsSelected?.RenderEditor || noop
        const match = allLenses.find(l => l.TypeId === targetConfig?.type)
        if (!match) return noop
        return match.Self?.AsSelected?.RenderEditor || noop
	}, [ lensId, targetConfig, configuredLenses ])

    // Flip to "General" tab when the modal opens
    useEffect(() => {
        if (ed.isOpen) setLensId(null)
        console.log({ item: ed.item })
    }, [ ed.isOpen ])

    return (
        <ModalPopover open={ ed.isOpen } onClose={ ed.close } title='Edit Item'>
            <ItemEditorFrame onSelectLens={ setLensId } selectedLens={ lensId }>
                <>
                    <Content itemId={ itemId } onDone={ noop } config={ targetConfig } />
                </>
            </ItemEditorFrame>
        </ModalPopover>
    )

})