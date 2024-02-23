import React, { useState } from "react";
import { useConfirm } from "../../stores/useConfirm";
import { BottomSheetPopover } from "./BottomSheetPopover";
import { TrText } from "../Text/Text";
import { Flex } from "../Flex/Flex";
import { Button } from "../Button/Button";
import { Bump } from "../Bump/Bump";

export const ConfirmPopover = React.memo(() => {

    const confirm = useConfirm();

    const [ loading, setLoading ] = useState(false)
    const handleConfirm = async () => {
        const result = confirm.onConfirm()
        try {
            if (!!(result?.then)) {
                setLoading(true)
                await result
            }
        } catch (e) {}
        setLoading(false)
        confirm.close()
    }

    return (
        <BottomSheetPopover open={ confirm.isOpen } onClose={ confirm.close } title={ confirm.title }>
            <Flex column>
                { confirm.subtitle ? <TrText style={{ marginBottom: 20 }} medium>{ confirm.subtitle }</TrText> : null }
                <Flex row>
                    <Button onClick={ handleConfirm } variant='submit' disabled={ loading }>{ confirm.confirmLabel || 'Yes, Confirm' }</Button>
                    <Bump w={ 20 } />
                    <Button onClick={ () => { confirm.close(); } }>{ confirm.cancelLabel || 'Cancel' }</Button>
                </Flex>
            </Flex>
        </BottomSheetPopover>
    )

})