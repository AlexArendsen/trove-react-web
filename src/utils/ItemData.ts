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
    }
}