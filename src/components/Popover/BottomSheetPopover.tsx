import React from "react";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PopoverOverlay } from "./PopoverOverlay";
import { Bump } from "../Bump/Bump";

export const BottomSheetPopover = React.memo((props: {
    open: boolean,
    onClose: () => void,
    title: string,
    children: JSX.Element
}) => {

    const { open, onClose, title, children } = props

    if (!open) return null

    return (
        <>

            <PopoverOverlay onClick={ onClose } />

            <Flex row justify='center' style={{
                position: 'absolute',
                zIndex: 1100,
                width: '100vw',
                bottom: 0,
                left: 0
            }}>
                <div style={{maxWidth: 640, minWidth: 640, backgroundColor: 'white', minHeight: 200}}>
                    <div style={{
                        background: 'linear-gradient(90deg, rgba(74,50,172,1) 0%, rgba(156,34,158,1) 50%, rgba(0,194,255,1) 100%)',
                        height: 4
                    }}>
                        <div style={{
                            padding: 20
                        }}>
                            <Flex row justify='space-between'>
                                <TrText mediumLarge>{ title }</TrText>
                                <FontAwesomeIcon icon={ faXmark } onClick={ onClose } />
                            </Flex>
                            <Bump h={ 20 } />
                            { children }
                        </div>
                    </div>
                </div>
            </Flex>

        </>
    )

})