import React from "react";
import { Flex } from "../Flex/Flex";
import { TrText } from "../Text/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PopoverOverlay } from "./PopoverOverlay";
import { Bump } from "../Bump/Bump";
import { useWindowSize } from "../../hooks/UseWindowSize";

export const ModalPopover = React.memo((props: {
    open: boolean,
    onClose: () => void,
    title: string,
    children: JSX.Element
}) => {

    const { open, onClose, title, children } = props

    const { isMobile } = useWindowSize()

    if (!open) return null

    return (
        <>

            <PopoverOverlay onClick={ onClose } />

            <Flex row center style={{
                position: 'absolute',
                zIndex: 1101,
                left: 0,
                top: 0,
                width: '100vw',
                height: '100%'
            }}>

                <Flex column style={{
                    maxWidth: '100vw', width: 800,
                    height: isMobile ? '100%' : 800,
                    backgroundColor: 'white',
                    borderRadius: isMobile ? 0 : 8,
                    overflow: 'hidden'
                }}>
                    <div style={{
                        background: 'linear-gradient(90deg, rgba(74,50,172,1) 0%, rgba(156,34,158,1) 50%, rgba(0,194,255,1) 100%)',
                        height: 8
                    }}>
                    </div>
                    <Bump h={ 15 } />
                        <div style={{ padding: `0 30px` }}>
                            <Flex row justify='space-between' align='center'>
                                <TrText small bold style={{ textTransform: 'uppercase' }}>{ title }</TrText>
                                <FontAwesomeIcon icon={ faXmark } onClick={ onClose } size='lg' style={{ cursor: 'pointer' }} />
                            </Flex>
                        </div>
                    <Bump h={ 15 } />
                    <Flex column style={{
                        padding: `0 30px`,
                        flex: 1,
                        overflowY: 'scroll'
                    }}>
                        { children }
                        <Bump h={ isMobile ? 40 : 0 } />
                    </Flex>
                </Flex>

            </Flex>

        </>
    )

})