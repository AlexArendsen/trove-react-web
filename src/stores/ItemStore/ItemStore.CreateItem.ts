import { Item } from "../../redux/models/Items/Item"
import { ItemStoreHelpers } from "./ItemStore.Helpers"
import { ItemStoreAccess } from "./useItemStore"
import { ItemStoreDefaultStorageDriver } from "./ItemStore.StorageDriver"

export const ItemStoreCreateItem = async (store: ItemStoreAccess, title: string, parentId: string, extras?: Partial<Item>) => {

    // Create item with pending field, retab parent and up
    const tempId = `TEMPID${new Date().getTime()}`
    const item: Item = { title: `[Loading]${title}`, parent_id: parentId, user_id: '', checked: false, ...extras, _id: tempId }
    console.log('Inserting item', item)
    const optimisticState = ItemStoreHelpers.AddItem(store, item)
    ItemStoreHelpers.RetabBubbleUp(optimisticState, [ parentId ])
    store.set(optimisticState)

    // Send POST to API
    try {
        const response = await ItemStoreDefaultStorageDriver.create(item)
        console.log('RESPONSE', response)

        // Update item with new ID
        const confirmedState = ItemStoreHelpers.ReplaceItem(store, response.data, tempId)
        ItemStoreHelpers.RetabBubbleUp(confirmedState, [ parentId ])
        store.set(confirmedState)

    } catch (e) {

        // If create fails, remove the item and post an error toast
        const revertState = ItemStoreHelpers.RemoveItem(store, tempId)
        ItemStoreHelpers.RetabBubbleUp(revertState, [ parentId ])
        store.set(revertState)

    }

}
