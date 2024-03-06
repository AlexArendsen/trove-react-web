import { Item } from "../../redux/models/Items/Item";
import { ItemSort } from "../../redux/models/Items/ItemSort";
import { GroupByFirst } from "../../utils/Arrays";
import { ItemStoreHelpers } from "./ItemStore.Helpers";
import { ItemStoreDefaultStorageDriver } from "./ItemStore.StorageDriver";
import { ItemStoreAccess } from "./useItemStore";

export const ItemStoreSortItems = async (store: ItemStoreAccess, updates: ItemSort[]) => {

    // Record all current item ranks and parents
    const originals = GroupByFirst(updates.map(u => ({ ...store.get().byId[u.itemId] })), i => i._id)
    const oldParents = Object.values(originals).map(o => o.parent_id)
    const newParents = updates.map(u => u.newParent)

    // Update all items with new ranks and parents, retab all old parents, new parent, and up
    let optimisticState = store.get()
    updates.forEach(u => {
        const sorted: Item = { ...optimisticState.byId[u.itemId], rank: u.newRank, parent_id: u.newParent }
        optimisticState = ItemStoreHelpers.ReplaceItem({ get: () => optimisticState, set: () => {} }, sorted, u.itemId)
    })
    const parentsToRetab = Array.from(new Set([...oldParents, ...newParents]))
    ItemStoreHelpers.RetabBubbleUp(optimisticState, parentsToRetab)
    store.set(optimisticState)

    // Send PUT to API
    try {
        await ItemStoreDefaultStorageDriver.sort(updates)
    } catch (e) {

        console.error('Failed to sort!')
        console.error(e)

        // On failure, unsort, retab, send error toast
        let revertState = store.get()
        updates.forEach(u => {
            optimisticState = ItemStoreHelpers.ReplaceItem({ get: () => optimisticState, set: () => {} }, originals[u.itemId], u.itemId)
        })
        const parentsToRetab = Array.from(new Set([...oldParents, ...newParents]))
        ItemStoreHelpers.RetabBubbleUp(revertState, parentsToRetab)
        store.set(revertState)

    }

}