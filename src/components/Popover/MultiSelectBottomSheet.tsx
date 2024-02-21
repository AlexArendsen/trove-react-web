import React, { useMemo } from "react";
import { BottomSheetPopover } from "./BottomSheetPopover";
import { useMultiSelect } from "../../stores/useMultiSelect";
import { Button } from "../Button/Button";
import { useMoveEditor } from "../../stores/useMoveEditor";

export const MultiSelectBottomSheet = React.memo(() => {

    const ms = useMultiSelect()
    const move = useMoveEditor()

    const title = useMemo(() => {
        const s = ms.itemIds?.size
        return s === 1 ? `1 Item` : `${s} Items`
    }, [ms.itemIds?.size])


    const handleClickMove = () => {
        const ids = Array.from(ms.itemIds)
        ms.stop()
        move.open(ids)
    }

    return (
        <BottomSheetPopover
            variant='multiselect'
            open={ ms.isEnabled }
            onClose={ ms.stop }
            title={title}
            withoutOverlay
        >
            <Button onClick={ handleClickMove } variant='submit'>
                Move
            </Button>
        </BottomSheetPopover>
    )

})