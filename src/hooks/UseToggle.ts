import { useMemo, useState } from "react"

export interface ToggleContext {
    isOpen: boolean
    isClosed: boolean
    open: () => void
    close: () => void
    set: (val: boolean) => void
}

export const useToggle = (defaultValue: boolean = false): ToggleContext => {

    const [ val, setVal ] = useState(defaultValue)
    return useMemo(() => ({
        isOpen: val,
        isClosed: !val,
        open: () => setVal(true),
        close: () => setVal(false),
        set: setVal
    }), [ val ])

}