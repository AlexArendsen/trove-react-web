import { create } from "zustand";
import { Item } from "../redux/models/Items/Item";
import { GetFromStore } from "../utils/GetFromStore";
import { GetConfig } from "../utils/Config";
import { DeleteOneItemAction, UpdateOneItemAction } from "../redux/actions/ItemActions";

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
        const i = GetFromStore(s => s.items.byId[itemId])
        if (!!i) set({ isOpen: true, item: i })
    },
    close: () => { set({ isOpen: false, item: null }) },

    item: null,

    save: () => {
        const i = get().item
        if(!!i) GetConfig().Store?.dispatch(UpdateOneItemAction(i) as any)
    },
    delete: () => {
        const itemId = get().item?._id
        if(!!itemId) GetConfig().Store?.dispatch(DeleteOneItemAction(itemId) as any)
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