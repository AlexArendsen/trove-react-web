import React, { useMemo } from "react";
import { TrText } from "../Text/Text";
import { Flex } from "../Flex/Flex";

export const BooleanBubbles = React.memo((props: {
    options: { label: string, value: any }[],
    selected: any[],
    onSelectedChange?: (values: any[]) => void
    onCheck?: (value: any) => void
    onUncheck?: (value: any) => void
}) => {

    const { options, selected, onCheck, onUncheck, onSelectedChange } = props

    const handleChange = (value: any, op: 'check' | 'uncheck') => {
        if (op === 'check' && onCheck) onCheck(value)
        else if (op === 'uncheck' && onUncheck) onUncheck(value)

        if (onSelectedChange) {
            const arr = [ ...selected ]
                .filter(x => x !== value) // remove the value in any case, to avoid duplicate values
            if (op === 'check') onSelectedChange([ ...arr, value ])
            else if (op === 'uncheck') onSelectedChange(arr)
        }
    }

    const selectedSet = useMemo(() => new Set(selected), [ selected ])

    return (
        <Flex row>
            {
                options.map(o => (
                    <BooleanBubble
                        checked={ selectedSet.has(o.value) }
                        label={ o.label }
                        onCheck={ () => handleChange(o.value, 'check') }
                        onUncheck={ () => handleChange(o.value, 'uncheck') }
                        style={{ marginRight: 20 }}
                        />
                ))
            }
        </Flex>
    )

})

const BooleanBubble = React.memo((props: {
    label: string
    checked: boolean
    style: React.CSSProperties
    onCheck: () => void
    onUncheck: () => void
}) => {

    const { label, checked, style, onCheck, onUncheck } = props

    return (
        <Flex center style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: checked ? '#C32986' : 'white',
            border: 'solid 2px',
            borderColor: checked ? 'transparent' : '#CCC',
            cursor: 'pointer',
            ...style
        }} onClick={ checked ? onUncheck : onCheck }>
            <TrText style={{ color: checked ? 'white' : 'black' }} medium bold>{ label }</TrText>
        </Flex>
    )

})