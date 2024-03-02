import { Item } from "../../redux/models/Items/Item";
import { ItemStoreHelpers } from "./ItemStore.Helpers";
import { ItemStoreAccess } from "./useItemStore";
import { ItemStoreDefaultStorageDriver } from "./ItemStore.StorageDriver";

export const ItemStoreUpdateOneItem = async (store: ItemStoreAccess, itemId: string, update: Partial<Item>) => {

    // TODO -- Deny requests to update checked, parent, or ID

    // Save current copy
    const original = { ...store.get().byId[itemId] }

    // Update item
    const updated = { ...original, ...update }
    const optimisticState = ItemStoreHelpers.ReplaceItem(store, updated, itemId)
    store.set(optimisticState)

    // Send PUT to API
    try {
        await ItemStoreDefaultStorageDriver.updateOne(updated)
    } catch (e) {
        // If update fails, revert, send error toast
        const revertState = ItemStoreHelpers.ReplaceItem(store, original, itemId)
        store.set(revertState)
    }


}