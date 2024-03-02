import { ItemStoreHelpers } from "./ItemStore.Helpers";
import { ItemStoreDefaultStorageDriver } from "./ItemStore.StorageDriver";
import { ItemStoreAccess } from "./useItemStore";

export const ItemStoreCheckItem = async (store: ItemStoreAccess, itemId: string) => { await ItemStoreSetItemChecked(store, itemId, true) }
export const ItemStoreUncheckItem = async (store: ItemStoreAccess, itemId: string) => { await ItemStoreSetItemChecked(store, itemId, false) }

const ItemStoreSetItemChecked = async (store: ItemStoreAccess, itemId: string, checked: boolean) => {

    // Update item, retab self and up
    const original = store.get().byId[itemId]
    const updatedItem = { ...original, checked }
    const optimisticState = ItemStoreHelpers.ReplaceItem(store, updatedItem, itemId)
    ItemStoreHelpers.RetabBubbleUp(optimisticState, [ itemId ])
    store.set(optimisticState)

    // Send PUT to API
    try {
        await ItemStoreDefaultStorageDriver.checkOne(itemId)
    } catch (e) {
        // If update fails, revert, send error toast
        const revertState = ItemStoreHelpers.ReplaceItem(store, original, itemId)
        ItemStoreHelpers.RetabBubbleUp(revertState, [ itemId ])
        store.set(revertState)
    }

}