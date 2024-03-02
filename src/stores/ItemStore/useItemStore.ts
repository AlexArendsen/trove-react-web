import { create } from "zustand"
import { Item } from "../../redux/models/Items/Item"
import { ItemSort } from "../../redux/models/Items/ItemSort"
import { ItemStoreLoadItems } from "./ItemStore.LoadItems"
import { ItemStoreCreateItem } from "./ItemStore.CreateItem"
import { ItemStoreUpdateOneItem } from "./ItemStore.UpdateItem"
import { ItemStoreCheckItem, ItemStoreUncheckItem } from "./ItemStore.CheckItem"

export type ItemStoreState = {

    isLoading: boolean
    //items: Item[]
    byId: Record<string, Item>
    byParent: Record<string, Item[]>
    root?: Item

    load: () => Promise<void>

    create: (title: string, parentId: string, extras?: Partial<Item>) => Promise<void>

    updateOne: (itemId: string, update: Partial<Item>) => Promise<void>
    checkOne: (itemId: string) => Promise<void>
    uncheckOne: (itemId: string) => Promise<void>

    moveOne: (itemId: string, newParentId: string) => Promise<void>
    moveMany: (itemIds: string[], newParentId: string) => Promise<void>

    deleteOne: (itemId: string) => Promise<void>
    deleteMany: (itemIds: string[]) => Promise<void>

    sort: (update: ItemSort[]) => Promise<void>

}

export type ItemStoreAccess = {
    set: (update: Partial<ItemStoreState>) => void,
    get: () => ItemStoreState
}

const wrappedAccess = (access: ItemStoreAccess): ItemStoreAccess => {
    return {
        get: access.get,
        set: (update: Partial<ItemStoreState>) => {
            console.log('STATE UPDATE')
            //console.log(`   items updated? ${ access.get().items === update.items ? 'no' : 'yes' }`)
            console.log(`   byId updated?  ${ access.get().byId === update.byId ? 'no' : 'yes' }`)
            console.log(`   byParent updated? ${ access.get().byParent === update.byParent ? 'no' : 'yes' }`)

            const pp = (window as any).PARENT_PEEK as string;
            if (pp) {
                if (!update.byParent) console.log(`   byParent not touched by update`)
                else console.log(`   byParent[${pp}] updated? ${ access.get().byParent[pp] === update.byParent?.[pp] ? 'no' : 'yes' }`)
            }

            const ip = (window as any).ID_PEEK as string;
            if (ip) {
                if (!update.byId) console.log(`   byId not touched by update`)
                else console.log(`   byId[${ip}] updated? ${ access.get().byId[ip] === update.byId?.[ip] ? 'no' : 'yes' }`)
            }

            access.set(update)
        }
    }
}

export const useItemStore = create<ItemStoreState>((set, get) => {

    return {

        isLoading: false,
        //items: [],
        byId: {},
        byParent: {},
        root: undefined,

        load: async () => await ItemStoreLoadItems({ set, get }),

        create: async (title: string, parentId: string, extras?: Partial<Item>) => await ItemStoreCreateItem({ set, get }, title, parentId, extras),

        updateOne: async (itemId: string, update: Partial<Item>) => await ItemStoreUpdateOneItem({ set, get }, itemId, update),

        checkOne: async (itemId: string) => await ItemStoreCheckItem({ set, get }, itemId),

        uncheckOne: async (itemId: string) => await ItemStoreUncheckItem({ set, get }, itemId),

        moveOne: async (itemId: string, newParentId: string) => {
            // Save current parent
            // Move item, retab old and new parents and up
            // Send PUT to API
            // If update fails, move back, send error toast
            // Retab old and new parents, and up
        },

        moveMany: async (itemIds: string[], newParentId: string) => {
            // Save current parents
            // Move items, retab all old parents, new parent, and up
            // Send PUT to API
            // On failure, move back, send error toast
            // Retab all old parents, new parent, and up
        },

        deleteOne: async (itemId: string) => {
            // Save copy
            // Delete item, retab parent and up
            // Send DELETE to API
            // If failed, restore from copy, send error toast
            // Retab old parent and up
        },

        deleteMany: async (itemIds: string[]) => {
            // Save copies in list
            // Delete items, retab all old parents and up
            // Send DELETE to API
            // If failed, restore from copies, send error toast
            // Retab all old parents and up
        },

        sort: async (updates: ItemSort[]) => {
            // Record all current item ranks and parents
            // Update all items with new ranks and parents, retab all old parents, new parent, and up
            // Send PUT to API
            // If failed, restore all item ranks and parents, send error toast
            // Retab all old parents and up
        }

    }

})