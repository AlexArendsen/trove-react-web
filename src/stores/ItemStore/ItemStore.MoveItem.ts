import { Item } from "../../redux/models/Items/Item";
import { GroupByFirst } from "../../utils/Arrays";
import { ItemStoreHelpers } from "./ItemStore.Helpers";
import { ItemStoreDefaultStorageDriver } from "./ItemStore.StorageDriver";
import { ItemStoreAccess } from "./useItemStore";

export const ItemStoreMoveOneItem = async (store: ItemStoreAccess, itemId: string, newParentId: string) => {

    return await ItemStoreMoveManyItems(store, [itemId], newParentId)

    // // Save current parent
    // const original = { ...store.get().byId[itemId] }
    // const originalParent = store.get().byId[itemId]?.parent_id

    // // Move item, retab old and new parents and up
    // const moved =  { ...original, parent_id: newParentId }
    // const optimisticState = ItemStoreHelpers.ReplaceItem(store, moved, itemId)
    // ItemStoreHelpers.RetabBubbleUp(optimisticState, [originalParent, newParentId])
    // store.set(optimisticState)

    // // Send PUT to API
    // try {
    //     await ItemStoreDefaultStorageDriver.updateOne(moved)
    // } catch (e) {

    //     // If update fails, move back, send error toast
    //     ItemStoreHelpers.ReplaceItem(store, original, itemId)

    //     // Retab old and new parents, and up
    //     ItemStoreHelpers.RetabBubbleUp(optimisticState, [originalParent, newParentId])

    // }


}

export const ItemStoreMoveManyItems = async (store: ItemStoreAccess, itemIds: string[], newParentId: string) => {

    // Save current parents
    const originalCopies: Record<string, Item> = GroupByFirst(itemIds.map(id => ({ ...store.get().byId[id]})), i => i._id)
    const oldParents = Object.values(originalCopies).map(x => x.parent_id).filter(x => !!x) as string[]

    // Move items, retab all old parents, new parent, and up
    let optimisticState = store.get()
    itemIds.forEach(id => {
        const moved: Item = { ...optimisticState.byId[id], parent_id: newParentId }
        optimisticState = ItemStoreHelpers.ReplaceItem({ get: () => optimisticState, set: () => {} }, moved, id)
    })
    const parentsToRetab = Array.from(new Set([...oldParents, newParentId]))
    ItemStoreHelpers.RetabBubbleUp(optimisticState, parentsToRetab)
    store.set(optimisticState)

    // Send PUT to API
    try {
        await ItemStoreDefaultStorageDriver.moveMany(itemIds, newParentId)
    } catch (e) {

        // On failure, move back, retab, send error toast
        let revertState = store.get()
        itemIds.forEach(id => {
            const moved: Item = { ...revertState.byId[id], parent_id: originalCopies[id].parent_id }
            revertState = ItemStoreHelpers.ReplaceItem({ get: () => revertState, set: () => {} }, moved, id)
        })
        const parentsToRetab = Array.from(new Set([...oldParents, newParentId]))
        ItemStoreHelpers.RetabBubbleUp(revertState, parentsToRetab)
        store.set(revertState)

    }


}