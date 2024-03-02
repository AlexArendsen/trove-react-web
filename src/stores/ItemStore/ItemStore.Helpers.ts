import { Item } from "../../redux/models/Items/Item";
import { MoreMath } from "../../utils/MoreMath";
import { ItemStoreAccess, ItemStoreState } from "./useItemStore";

const AddItem = (store: ItemStoreAccess, newItem: Item): ItemStoreState => {

    const { byId, byParent } = store.get()

    byId[newItem._id] = newItem
    const par = newItem.parent_id
    if (par) {
        if (!byParent[par]) byParent[par] = [newItem]
        else byParent[par] = [ ...byParent[par], newItem ]
    }

    return { ...store.get(), byId, byParent }

}

const RemoveItem = (store: ItemStoreAccess, itemId: string): ItemStoreState => {

    const { byId, byParent } = store.get()

    const parent = byId[itemId].parent_id
    delete byId[itemId]
    if (parent && byParent[parent]) byParent[parent] = byParent[parent].filter(e => e._id !== itemId)

    return { ...store.get(), byId, byParent }

}

const ReplaceItem = (store: ItemStoreAccess, newItem: Item, replaceId: string): ItemStoreState => {

    const { byId, byParent } = store.get()

    const oldId = replaceId
    const newId = newItem._id

    const oldParent = byId[replaceId].parent_id || ''
    const newParent = newItem.parent_id || ''

    // If ID has updated (e.g., new item confirm), get rid of the old one
    if (oldId !== newId) delete byId[oldId]
    byId[newId] = newItem

    // If parent has changed, update byParent accordingly
    if (oldParent !== newParent) {
        byParent[oldParent] = byParent[oldParent].filter(i => i._id !== oldId)
        byParent[newParent] = [ ...byParent[newParent], newItem ]
    } else { // ... otherwise, just update it in place
        byParent[oldParent] = byParent[oldParent].map(i => i._id === newId ? newItem : i)
    }

    return { ...store.get(), byId, byParent }

}

const RetabBubbleUp = (
    state: ItemStoreState,
    startIds: string[]
) => {


    for(const start in startIds) {

        // We shouldn't have trouble with cycles, but just in case
        const updated = new Set<string>()

        // Retab this item, and then its parent, and so on until we reach root / null
        let wrk = state.byId[start]

        while (!!wrk) {

            // Cycle breaker
            if (updated.has(wrk._id)) break;
            else updated.add(wrk._id)

            // Add up children stats
            const children = state.byParent[wrk._id]
            wrk.descendants = MoreMath.Sum(children.map(c => c.descendants || 1))
            wrk.completed = MoreMath.Sum(children.map(c => c.checked ? c.descendants || 1 : c.completed || 0))

            // Go up to parent
            if (!wrk.parent_id) break;
            wrk = state.byId[wrk.parent_id]

        }

    }

}

export const ItemStoreHelpers = {
    AddItem,
    RemoveItem,
    ReplaceItem,
    RetabBubbleUp
}