import React, { useMemo, useState } from "react";
import { allLenses } from "../../hooks/UseItemLens";
import { useItemEditor } from "../../stores/useItemEditor";
import { ModalPopover } from "../Popover/ModalPopover";
import { ItemEditorFrame } from "./ItemEditorFrame";
import { ItemEditorNewLensPage } from "./ItemEditorNewLensPage";

const noop = () => null
export const ItemEditorModal = React.memo(() => {

    const ed = useItemEditor()
    const itemId = ed.item?._id || ''

    const [ lensId, setLensId ] = useState<string | null>(null)
	const Content: ((props: any) => JSX.Element | null) = useMemo(() => {
        if (lensId === '%ADD') return ItemEditorNewLensPage
        const match = allLenses.find(l => l.TypeId === lensId)
        if (!match) return noop
        return match.Self?.AsSelected?.RenderEditor || noop
	}, [ lensId ])

    return (
        <ModalPopover open={ ed.isOpen } onClose={ ed.close } title='Edit Item'>
            <ItemEditorFrame onSelectLens={ setLensId } selectedLens={ lensId }>
                <Content itemId={ itemId } onDone={ noop } />
            </ItemEditorFrame>
        </ModalPopover>
    )

})