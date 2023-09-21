import { LensConfiguration } from "../components/ItemEditor/ItemEditorNewLensPage";
import { Item } from "../redux/models/Items/Item";

export const ItemData = {
    get: <TData>(item: Item | null, key: string, defaultValue: TData) => (item?.data?.[key] || defaultValue) as TData,
    set: <TData>(item: Item | null, key: string, value: TData) => {
        if (!item) return
        if (!item.data) item.data = {};
        item.data[key] = value
    },

    mutate: <TData>(item: Item | null, key: string, defaultValue: TData, mutate: (data: TData) => void) => {
        const v = ItemData.get<TData>(item, key, defaultValue)
        mutate(v)
        ItemData.set(item, key, v)
    },

    getLensData: <TData>(item: Item | null, lensId: string, defaultValue: TData) => {
        return ((item?.data?.__lenses as LensConfiguration[])?.find(l => l.id === lensId)?.data || defaultValue) as TData
    },

    setLens: (item: Item | null, lensId: string, value: LensConfiguration) => {
        if (!item) return
        if (!item.data) item.data = {};
        if (!item.data?.__lenses) item.data.__lenses = []
        let lenses = item.data.__lenses as LensConfiguration[]
        lenses = lenses.map(l => l.id === lensId ? value : l )
        item.data.__lenses = lenses
    },

    setLensData: <TData>(item: Item | null, lensId: string, value: TData) => {
        if (!item) return
        if (!item.data) item.data = {};
        if (!item.data?.__lenses) item.data.__lenses = []
        const lenses = item.data.__lenses as LensConfiguration[]
        const updatedLens = lenses.find(l => l.id === lensId)
        if (!updatedLens) return
        updatedLens.data = value
        item.data.__lenses = lenses.map(l => l.id === lensId ? updatedLens : l)
    },

    mutateLensData: <TData>(item: Item | null, lensId: string, defaultValue: TData, mutate: (data: TData) => void) => {
        const v = ItemData.getLensData<TData>(item, lensId, defaultValue)
        mutate(v)
        ItemData.setLensData(item, lensId, v)
    },

    setItemLocalMemo: (item: Item | null, key: string, value: string) => {
        localStorage.setItem(`item:${item?._id}:${key}`, value)
    },

    getItemLocalMemo: (item: Item | null, key: string) => localStorage.getItem(`item:${item?._id}:${key}`)
}