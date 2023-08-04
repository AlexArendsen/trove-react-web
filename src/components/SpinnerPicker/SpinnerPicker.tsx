import React, { useMemo } from "react"
import { Flex } from "../Flex/Flex"
import { TrText } from "../Text/Text"
import { faChevronLeft, faChevronRight, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const SpinnerPicker = React.memo((props: {
    label?: string,
    onUp: () => void
    onDown: () => void
    disabled?: boolean
    style?: React.CSSProperties
}) => {

    const { label, onUp, onDown, disabled, style } = props


    return (
        <Flex row align='center' style={{ borderRadius: 30, border: 'solid 2px #ccc', opacity: disabled ? 0.5 : 1, maxWidth: 200, padding: 4, ...style }}>
            <SpinnerPickerThumber variant='left' lineSide='right' onClick={ onDown } />
            <TrText bold style={{ flex: 1, padding: 10, margin: '0 10px', whiteSpace: 'nowrap', textAlign: 'center' }}>{ label }</TrText>
            <SpinnerPickerThumber variant='right' lineSide='left' onClick={ onUp } />
        </Flex>
    )

})

const SpinnerPickerThumber = React.memo((props: {
    variant: 'plus' | 'minus' | 'left' | 'right'
    lineSide: 'right' | 'left'
    onClick: () => void
}) => {

    const { variant, lineSide, onClick } = props

    const c = useMemo(() => {
        switch(variant) { 
            case 'left': return <FontAwesomeIcon icon={faChevronLeft} size='sm' />
            case 'right': return <FontAwesomeIcon icon={faChevronRight} size='sm' />
            case 'plus': return <FontAwesomeIcon icon={faPlus} size='sm' />
            case 'minus': return <FontAwesomeIcon icon={faMinus} size='sm' />
            default: return 'o'
        }
    }, [ variant ])

    return (
        <div style={{
            padding: '6px 12px',
            cursor: 'pointer'
        }} onClick={ onClick }>
            { c }
        </div>
    )

})