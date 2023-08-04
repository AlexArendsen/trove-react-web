import React, { useMemo } from "react"
import { SpinnerNumericPicker } from "./SpinnerNumericPicker"

export interface SpinnerPickerOption { label: string, value: any }
export const SpinnerOptionPicker = React.memo((props: {
    options: SpinnerPickerOption[],
    onChange?: (value: any) => void
    value: any,
    disabled?: boolean
    style?: React.CSSProperties
}) => {

    const { options, onChange, value, disabled, style } = props

    const { selectedOption, selectedIndex } = useMemo(() => {
        const idx = options.findIndex(o => o.value === value)
        return { selectedOption: options[idx], selectedIndex: idx }
    }, [ value, options ])

    return <SpinnerNumericPicker
        onChange={ v => onChange?.(options[v].value) }
        renderLabel={ () => selectedOption?.label || '' }
        value={ selectedIndex }
        max={ options.length - 1 }
        min={ 0 }
        style={ style }
        />

})