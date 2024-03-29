import { create } from "zustand";
import { Item } from "../redux/models/Items/Item";
import { useItemStore } from "./ItemStore/useItemStore";
import { LensConfiguration } from "../components/ItemEditor/ItemEditorNewLensPage";

type ItemEditorStore = {

    isOpen: boolean
    open: (itemId: string) => void
    close: () => void

    item: Item | null

    save: () => void
    delete: () => void
    revert: () => void

    lenses: {
        add: (config: LensConfiguration) => void
        update: (lensId: string, config: LensConfiguration) => void
        delete: (lensId: string) => void
        setData: <TData>(lensId: string, data: TData) => void
    }

    updateItem: (updates: Partial<Item>) => void
    handleKeyDown: (ev: React.KeyboardEvent) => void

}

export const useItemEditor = create<ItemEditorStore>((set, get) => ({

    isOpen: false,
    open: (itemId: string) => {
        const i = useItemStore.getState().byId[itemId]
        if (!!i) set({ isOpen: true, item: CopyItem(i) })
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

    lenses: {
        add: (config) => {
            if (!get().item) return;
            const updated = CopyItem(get().item!)
            updated.data.__lenses = [ ...updated.data.__lenses, config ]
            set({ item: updated as any })
        },
        update: (id, config) => {
            if (!get().item) return;
            const updated = CopyItem(get().item!)
            updated.data.__lenses = updated.data.__lenses.map((l: LensConfiguration) => {
                return (l.id === id) ? { ...l, ...config, id: l.id } : l;
            })
            set({ item: updated as any })
        },
        delete: (id) => {
            if (!get().item) return;
            const updated = CopyItem(get().item!)
            updated.data.__lenses = updated.data.__lenses.filter((l: LensConfiguration) => l.id !== id)
            set({ item: updated as any })
        },
        setData: (id, data) => {
            if (!get().item) return;
            const updated = CopyItem(get().item!)
            updated.data[`__lens${id}`] = data
            set({ item: updated as any })
        }
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

const CopyItem = (item: Item) => {
    const copied = { ...item }
    copied.data = !copied.data ? {} : { ...copied.data } // This unlinks data from the underlying item in the store
    if (!copied.data.__lenses) copied.data.__lenses = []
    return copied
}

export const useItemEditorLensIndex = () => useItemEditor(s => (s.item?.data?.__lenses || []) as LensConfiguration[])
export const useItemEditorLensData = <TData>(lensId: string) => useItemEditor(s => s.item?.data?.[`__lens${lensId}`] as TData)