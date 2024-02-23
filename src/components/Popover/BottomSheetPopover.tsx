import React from "react";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PopoverOverlay } from "./PopoverOverlay";
import { Bump } from "../Bump/Bump";
import { useWindowSize } from "../../hooks/UseWindowSize";

export const BottomSheetPopover = React.memo((props: {
    open: boolean
    onClose: () => void
    title: string
    withoutOverlay?: boolean
    variant?: 'multiselect' | 'default'
    children: JSX.Element
}) => {

    const { isMobile } = useWindowSize()
    const { open, onClose, title, children, withoutOverlay, variant } = props

    const effectBar = variant === 'multiselect'
        ? '#3061aa'
        : 'linear-gradient(90deg, rgba(74,50,172,1) 0%, rgba(156,34,158,1) 50%, rgba(0,194,255,1) 100%)';
    
    const borderRadius = isMobile ? undefined : '10px 10px 0 0'

    if (!open) return null

    return (
        <>

            { withoutOverlay ? null : <PopoverOverlay onClick={ onClose } /> }

            <Flex row justify='center' style={{
                position: 'fixed',
                zIndex: 1100,
                width: '100vw',
                bottom: 0,
                left: 0
            }}>
                <div style={{
                    maxWidth: isMobile ? '100%' : 640,
                    minWidth: isMobile ? '100%' : 640,
                    backgroundColor: 'white',
                    boxShadow: withoutOverlay ? '0 -8px 16px rgba(0,0,0,0.15)' : undefined,
                    borderRadius,
                    minHeight: 120
                }}>

                    <div style={{
                        background: effectBar,
                        height: 10,
                        borderRadius
                    }}>
                    </div>

                    <div style={{
                        padding: 20
                    }}>
                        <Flex row justify='space-between'>
                            <TrText small style={{ textTransform: 'uppercase' }}>
                                <strong>{ title }</strong>
                            </TrText>
                            <FontAwesomeIcon icon={ faXmark } onClick={ onClose } />
                        </Flex>
                        <Bump h={ 20 } />
                        { children }
                    </div>
                </div>
            </Flex>

        </>
    )

})