import axios, { AxiosResponse } from "axios"
import { Item } from "../../redux/models/Items/Item"
import { ItemSort } from "../../redux/models/Items/ItemSort"
import { Environment } from "../../utils/Environment"
import { GroupByFirst } from "../../utils/Arrays"

export type ItemStoreStorageDriverResponse<TData> = {
    data: TData
}

export type ItemStoreStorageDriver = {
    load: () => Promise<ItemStoreStorageDriverResponse<Item[]>>
    create: (item: Item) => Promise<ItemStoreStorageDriverResponse<Item>>
    updateOne: (item:Item) => Promise<ItemStoreStorageDriverResponse<Item>>
    checkOne: (itemId: string) => Promise<ItemStoreStorageDriverResponse<Item>>
    uncheckOne: (itemId: string) => Promise<ItemStoreStorageDriverResponse<Item>>
    moveMany: (itemIds: string[], newParentId: string) => Promise<ItemStoreStorageDriverResponse<void>>
    deleteOne: (itemId: string) => Promise<ItemStoreStorageDriverResponse<Item>>
    deleteMany: (itemIds: string[]) => Promise<ItemStoreStorageDriverResponse<Item[]>>
    sort: (update: ItemSort[]) => Promise<ItemStoreStorageDriverResponse<void>>
}

const ItemStoreApiStorageDriver: ItemStoreStorageDriver = {
    load: async () => ConvertAxiosResponse(await axios.get<Item[]>(`${Environment.getApiBaseUrl()}/items`)),
    create: async (item) => ConvertAxiosResponse(await axios.post<Item>(`${Environment.getApiBaseUrl()}/item`, item)),
    updateOne: async (item) => ConvertAxiosResponse(await axios.put<Item>(`${Environment.getApiBaseUrl()}/item`, item)),
    checkOne: async (itemId) => ConvertAxiosResponse(await axios.put<Item>(`${Environment.getApiBaseUrl()}/item/${itemId}/check`)),
    uncheckOne: async (itemId) => ConvertAxiosResponse(await axios.put<Item>(`${Environment.getApiBaseUrl()}/item/${itemId}/uncheck`)),
    moveMany: async (ids, new_parent) => ConvertAxiosResponse(await axios.put<void>(`${Environment.getApiBaseUrl()}/items/move`, { ids, new_parent })),
    deleteOne: async (itemId) => ConvertAxiosResponse(await axios.delete<Item>(`${Environment.getApiBaseUrl()}/item/${itemId}`)),
    deleteMany: async (ids) => ConvertAxiosResponse(await axios.delete<Item[]>(`${Environment.getApiBaseUrl()}/items`, { data: { ids: ids.join(',') } })),
    sort: async (updates) => ConvertAxiosResponse(await axios.put<void>(`${Environment.getApiBaseUrl()}/items/sort`, updates)),
}

const getLocalItems = (): Item[] => {
    try {
        return JSON.parse(localStorage.getItem('ITEMS') || '[]') as Item[]
    } catch (e) {
        return []
    }
}

const setLocalItems = (items: Item[]) => {
    localStorage.setItem('ITEMS', JSON.stringify(items))
}

const ItemStoreDebuggingLocalStorageDriver: ItemStoreStorageDriver = {

    load: async () => ({ data: getLocalItems() }),
    create: async (item) => {
        setLocalItems([ ...getLocalItems(), item ])
        return { data: item }
    },
    updateOne: async (item) => {
        const items = [ ...getLocalItems() ].map(i => i._id === item._id ? item : i)
        setLocalItems(items)
        return { data: item }
    },
    checkOne: async (itemId) => {
        const local = getLocalItems();
        const updated = local.find(l => l._id === itemId)
        if (!updated) throw new Error('Item does not exist')
        updated.checked = true
        const items = [ ...getLocalItems() ].map(i => i._id === itemId ? updated : i)
        setLocalItems(items)
        return { data: updated }
    },
    uncheckOne: async (itemId) => {
        const local = getLocalItems();
        const updated = local.find(l => l._id === itemId)
        if (!updated) throw new Error('Item does not exist')
        updated.checked = false
        const items = [ ...getLocalItems() ].map(i => i._id === itemId ? updated : i)
        setLocalItems(items)
        return { data: updated }
    },
    moveMany: async (ids, newParent) => {
        const idSet = new Set(ids)
        const items = getLocalItems().map(i => idSet.has(i._id) ? { ...i, parent_id: newParent } : i)
        setLocalItems(items)
        return { data: undefined }
    },
    deleteOne: async (id) => {
        const local = getLocalItems()
        const toDelete = local.find(i => i._id === id)
        if (!toDelete) throw new Error('Item does not exist')
        const items = local.filter(i => i._id !== id)
        setLocalItems(items)
        return { data: toDelete }
    },
    deleteMany: async (ids) => {
        const idSet = new Set(ids)
        const local = getLocalItems()
        const toDelete = local.filter(i => idSet.has(i._id))
        const items = getLocalItems().filter(i => !idSet.has(i._id))
        setLocalItems(items)
        return { data: toDelete }
    },
    sort: async (updates) => {
        const updateLookup = GroupByFirst(updates, u => u.itemId)
        const local = getLocalItems()
        const items = local.map(i => {
            if (updateLookup[i._id]) 
                return { ...i, ...updateLookup[i._id] }
            else
                return i
        })
        setLocalItems(items)
        return { data: undefined }
    }

}

const ConvertAxiosResponse = <TData>(response: AxiosResponse<TData>): ItemStoreStorageDriverResponse<TData> => {
    return { data: response.data }
}

export const ItemStoreDefaultStorageDriver = ItemStoreDebuggingLocalStorageDriver;