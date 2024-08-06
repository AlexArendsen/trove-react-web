import React from "react";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PopoverOverlay } from "./PopoverOverlay";
import { Bump } from "../Bump/Bump";
import { useWindowSize } from "../../hooks/UseWindowSize";
import './Popover.css';

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
                <div className='bottom-sheet' style={{
                    maxWidth: isMobile ? '100%' : 640,
                    minWidth: isMobile ? '100%' : 640,
                    boxShadow: withoutOverlay ? '0 -8px 16px var(--shadow)' : undefined,
                    borderRadius
                }}>

                    <div className='header-bar' style={{
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
                            <div onClick={ onClose } style={{ margin: -15, padding: 15, cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={ faXmark } />
                            </div>
                        </Flex>
                        <Bump h={ 20 } />
                        { children }
                    </div>
                </div>
            </Flex>

        </>
    )

})