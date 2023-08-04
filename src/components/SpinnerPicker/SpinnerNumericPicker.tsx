import React from "react"
import { SpinnerPicker } from "./SpinnerPicker"

export const SpinnerNumericPicker = React.memo((props: {
    value: number
    max?: number
    min?: number
    renderLabel: (value: number) => string
    onChange: (value: number) => void
    style?: React.CSSProperties
    disabled?: boolean
}) => {

    const { value, onChange, renderLabel, style, disabled } = props
    const min = props.min || 0
    const max = props.max || 100

    const handleChange = (incr: number) => {
        const next = value + incr
        if (next < min) onChange(max)
        else if (next > max) onChange(min)
        else onChange(next)
    }

    return (
        <SpinnerPicker
            onDown={ () => handleChange(-1) }
            onUp={ () => handleChange(1) }
            label={ renderLabel(value) }
            style={ style }
            disabled={ disabled }
            />
    )

})