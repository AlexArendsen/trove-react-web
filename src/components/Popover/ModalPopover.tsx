import React from "react";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
//@ts-ignore
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//@ts-ignore
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PopoverOverlay } from "./PopoverOverlay";
import { Bump } from "../Bump/Bump";
import { useWindowSize } from "../../hooks/UseWindowSize";
import './Popover.css';

export const ModalPopover = React.memo((props: {
    open: boolean,
    onClose: () => void,
    title: string,
    subtitle?: string,
    scrollMode?: 'scroll-all-content' | 'fixed-max-height-container'
    children: JSX.Element
}) => {

    const { open, onClose, title, subtitle, children, scrollMode } = props

    const { isMobile } = useWindowSize()

    if (!open) return null

    return (
        <>

            <PopoverOverlay onClick={ onClose } />

            <Flex row center style={{
                position: 'fixed',
                zIndex: 1101,
                left: 0,
                top: 0,
                width: '100vw',
                height: '100%'
            }}>

                <Flex column className='modal' style={{
                    height: isMobile ? '100%' : 800,
                    borderRadius: isMobile ? 0 : 8,
                }}>
                    <div className='header-bar'>
                    </div>
                    <Bump h={ 15 } />
                        <div style={{ padding: `0 30px` }}>
                            <Flex row justify='space-between' align='center'>
                                <TrText small style={{ textTransform: 'uppercase' }}>
                                    <strong>{ title }</strong>
                                    { subtitle ? (<span> · { subtitle }</span>) : null }
                                </TrText>
                                <FontAwesomeIcon icon={ faXmark } onClick={ onClose } size='lg' style={{ cursor: 'pointer' }} />
                            </Flex>
                        </div>
                    <Bump h={ 15 } />
                    <Flex column style={{
                        padding: `0 30px`,
                        flex: 1,
                        overflowY: scrollMode === 'scroll-all-content' ? 'scroll' : undefined,
                        maxHeight: scrollMode === 'fixed-max-height-container' ? '92%' : undefined
                    }}>
                        { children }
                        <Bump h={ isMobile ? 40 : 0 } />
                    </Flex>
                </Flex>

            </Flex>

        </>
    )

})