import React, { useMemo } from "react";
import { useItemStore } from "../../stores/ItemStore/useItemStore";
import { useConfirm } from "../../stores/useConfirm";
import { useMoveEditor } from "../../stores/useMoveEditor";
import { useMultiSelect } from "../../stores/useMultiSelect";
import { Bump } from "../Bump/Bump";
import { Button } from "../Button/Button";
import { Flex } from "../Flex/Flex";
import { BottomSheetPopover } from "./BottomSheetPopover";

export const MultiSelectBottomSheet = React.memo(() => {

    const ms = useMultiSelect()
    const move = useMoveEditor()
    const confirm = useConfirm()

    const title = useMemo(() => {
        const s = ms.itemIds?.size
        return s === 1 ? `1 Item` : `${s} Items`
    }, [ms.itemIds?.size])


    const handleClickMove = () => {
        const ids = Array.from(ms.itemIds)
        ms.stop()
        move.open(ids)
    }

    const handleClickDelete = () => {
        const ids = Array.from(ms.itemIds)
        ms.stop()
        const s = ids.length === 1 ? '' : 's'
        confirm.open({
            title: 'Delete Many',
            subtitle: `Are you sure you want to delete ${ids.length} item${s}?`,
            onConfirm: () => useItemStore.getState().deleteMany(ids)
        })
    }

    return (
        <BottomSheetPopover
            variant='multiselect'
            open={ ms.isEnabled }
            onClose={ ms.stop }
            title={title}
            withoutOverlay
        >
            <Flex row>
                <Button onClick={ handleClickMove } variant='submit'>Move</Button>
                <Bump w={ 20 } />
                <Button onClick={ handleClickDelete } variant='danger'>Delete</Button>
            </Flex>
        </BottomSheetPopover>
    )

})