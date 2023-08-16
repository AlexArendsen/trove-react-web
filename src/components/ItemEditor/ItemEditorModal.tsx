import React from "react";
import { useItemEditor } from "../../stores/useItemEditor";
import { ModalPopover } from "../Popover/ModalPopover";
import { LensedComponent } from "../../lenses/LensedComponent";

export const ItemEditorModal = React.memo(() => {

    const ed = useItemEditor()
    const itemId = ed.item?._id || ''

    return (
        <ModalPopover open={ ed.isOpen } onClose={ ed.close } title='Edit Item'>
            <LensedComponent itemId={ itemId } selector={ l => l.AsSelected?.RenderEditor } props={{ itemId: itemId, onDone: ed.close }} />
        </ModalPopover>
    )

})