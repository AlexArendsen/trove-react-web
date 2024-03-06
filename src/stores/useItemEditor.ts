import { create } from "zustand";
import { Item } from "../redux/models/Items/Item";
import { useItemStore } from "./ItemStore/useItemStore";

type ItemEditorStore = {

    isOpen: boolean
    open: (itemId: string) => void
    close: () => void

    item: Item | null

    save: () => void
    delete: () => void
    revert: () => void

    updateItem: (updates: Partial<Item>) => void
    handleKeyDown: (ev: React.KeyboardEvent) => void

}

export const useItemEditor = create<ItemEditorStore>((set, get) => ({

    isOpen: false,
    open: (itemId: string) => {
        const i = useItemStore.getState().byId[itemId]
        if (!!i) set({ isOpen: true, item: i })
    },
    close: () => { set({ isOpen: false, item: null }) },

    item: null,

    save: () => {
        const i = get().item
        if(!!i) useItemStore.getState().updateOne(i)
    },
    delete: () => {
        const itemId = get().item?._id
        if(!!itemId) useItemStore.getState().deleteOne(itemId)
    },
    revert: () => {
        const i = get().item
        if(!!i) get().open(i._id)
    },

    updateItem: (updates: Partial<Item>) => {
        const existing = get().item
        if (!!existing) set({ item: { ...existing, ...updates } })
    },

    handleKeyDown: (ev: React.KeyboardEvent) => {
        if (ev.ctrlKey && ev.key === 'Enter') {
            get().save()
            get().close()
        }
    }

}))