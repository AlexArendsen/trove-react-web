import React, { useMemo } from "react";
import { BottomSheetPopover } from "./BottomSheetPopover";
import { useMultiSelect } from "../../stores/useMultiSelect";
import { Button } from "../Button/Button";
import { useMoveEditor } from "../../stores/useMoveEditor";
import { Bump } from "../Bump/Bump";
import { Flex } from "../Flex/Flex";
import { useConfirm } from "../../stores/useConfirm";
import { useDispatch } from "react-redux";
import { DeleteManyItemsAction } from "../../redux/actions/ItemActions";

export const MultiSelectBottomSheet = React.memo(() => {

    const ms = useMultiSelect()
    const move = useMoveEditor()
    const confirm = useConfirm()
    const dispatch = useDispatch()

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
            onConfirm: () => dispatch(DeleteManyItemsAction(ids))
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