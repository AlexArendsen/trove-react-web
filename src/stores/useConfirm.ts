import { create } from "zustand"

type ConfirmDisplayFields = {
    title: string
    subtitle?: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => Promise<any> | any
}

type ConfirmState = ConfirmDisplayFields & {
    isOpen: boolean
    open: (options: ConfirmDisplayFields) => void
    close: () => void
}

const defaultDisplayFields: ConfirmDisplayFields = {
    title: '',
    subtitle: undefined,
    onConfirm: () => {},
}

export const useConfirm = create<ConfirmState>((set, get) => {

    return {

        isOpen: false,

        ...defaultDisplayFields,

        open: (options: ConfirmDisplayFields) => {
            set({ ...options, isOpen: true })
        },

        close: () => {
            set({ ...defaultDisplayFields, isOpen: false })
        }

    }

})