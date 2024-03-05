import { ItemStoreHelpers } from "./ItemStore.Helpers";
import { ItemStoreDefaultStorageDriver } from "./ItemStore.StorageDriver";
import { ItemStoreAccess } from "./useItemStore";

export const ItemStoreDeleteOneItem = async (store: ItemStoreAccess, itemId: string) => {

    return await ItemStoreDeleteManyItem(store, [ itemId ])

    // // Save copy
    // const original = store.get().byId[itemId]

    // // Delete item, retab parent and up
    // const optimisticState = ItemStoreHelpers.RemoveItem(store, itemId)
    // ItemStoreHelpers.RetabBubbleUp(optimisticState, [original.parent_id])
    // store.set(optimisticState)

    // // Send DELETE to API
    // try {
    //     await ItemStoreDefaultStorageDriver.deleteOne(itemId)
    // } catch (e) {

    //     // If failed, restore from copy, retab, send error toast
    //     const revertState = ItemStoreHelpers.AddItem(store, original)
    //     ItemStoreHelpers.RetabBubbleUp(revertState, [original._id])
    //     store.set(revertState)

    // }


}

export const ItemStoreDeleteManyItem = async (store: ItemStoreAccess, itemIds: string[]) => {

    // Save copies
    const originalCopies = itemIds.map(id => ({ ...store.get().byId[id]}))
    const oldParents = originalCopies.map(x => x.parent_id).filter(x => !!x) as string[]

    // Delete items, retab all old parents, new parent, and up
    let optimisticState = store.get()
    itemIds.forEach(id => {
        optimisticState = ItemStoreHelpers.RemoveItem({ get: () => optimisticState, set: () => {} }, id)
    })
    const parentsToRetab = Array.from(new Set(oldParents))
    ItemStoreHelpers.RetabBubbleUp(optimisticState, parentsToRetab)
    store.set(optimisticState)

    // Send DELETE to API
    try {
        await ItemStoreDefaultStorageDriver.deleteMany(itemIds)
    } catch (e) {

        // On failure, restore from copies, retab, send error toast
        let revertState = store.get()
        originalCopies.forEach(toUndelete => {
            revertState = ItemStoreHelpers.AddItem({ get: () => revertState, set: () => {} }, toUndelete)
        })
        const parentsToRetab = Array.from(new Set(oldParents))
        ItemStoreHelpers.RetabBubbleUp(revertState, parentsToRetab)
        store.set(revertState)

    }


}