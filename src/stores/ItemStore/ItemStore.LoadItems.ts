import axios from "axios";
import { ItemStoreAccess } from "./useItemStore";
import { Environment } from "../../utils/Environment";
import { GroupBy, GroupByFirst } from "../../utils/Arrays";
import { Item } from "../../redux/models/Items/Item";
import { MoreMath } from "../../utils/MoreMath";
import { ItemStoreDefaultStorageDriver } from "./ItemStore.StorageDriver";

export const ItemStoreLoadItems = async (store: ItemStoreAccess) => {

    // If already loading, don't do anything
    if (store.get().isLoading) return

    // Loading = true
    store.set({ isLoading: true })

    // Get items from API
    const response = await ItemStoreDefaultStorageDriver.load()

    // Loading = false
    store.set({ isLoading: false })

    // Remove orphans, tabulate stats
    const itemsRaw = [ ...response.data ]
    let byParent = GroupBy(itemsRaw, i => i.parent_id || '')
    const items = RetabEntireTree(RemoveOrphansAndLoops(itemsRaw, byParent))

    // Create byId, byParent lookups
    const byId = GroupByFirst(items, i => i._id)
    byParent = GroupBy(items, i => i.parent_id || '')
    const root = items.find(i => i.isRoot)
    console.log({ byId, root, items, response })

    //store.set({ items, byId, byParent, root })
    store.set({ byId, byParent, root })

}

// We don't want to waste our time with unnavigable items, or worse, items that form a loop
// Removing all items who are not descendants of the top-level items is an effective way to
// take care of this problem.
const RemoveOrphansAndLoops = (items: Item[], byParent: Record<string, Item[]>): Item[] => {

    console.log({ items, byParent }) 
    const looped = new Set<string>();
    const found = new Set<string>();
    const topLevelItems = items.filter(i => i.isRoot);
    const markChildren = (item: Item) => {
        if (found.has(item._id)) { // If we were already here, there was a loop; blacklist it
            looped.add(item._id)
            found.delete(item._id)
        } else if (looped.has(item._id)) { // If this item has been flagged as a loop component, get out of here
            return
        } else { // Otherwise, it's fine
            found.add(item._id);
            const children = byParent[item._id] || []
            children.forEach(x => markChildren(x));
        }
    }
    topLevelItems.forEach(markChildren);
    return items.filter(i => found.has(i._id));

}

// Retabulates ("retabs") a given item, and its children in the process
// Retabbing the entire tree is top-down recursive, while all other operations are bottom-up iterative; hence, two impls
type StatBundle = { descendants: number, completed: number }
const RetabEntireTree = (items: Item[]) => {

    const byParent = GroupBy(items, i => i.parent_id || '')
    const statCache: Record<string, StatBundle> = {}

	// Recursive runner:
	// - If we've already calculated the stats for this item, just use those.
	// - If the item has no children, its stats are zero
	// - If the item has children, recursively collect its child stats
	//   - Descendants is the # of your leaf children, plus the # of descendants of your non-leaf children
	//   - Completed is the number of children who are checked
    const statsFor = (item: Item): StatBundle => {
        if (statCache[item._id]) return statCache[item._id]

        let output: StatBundle = { descendants: 0, completed: 0 }
        const children = byParent[item._id]
        if (children) {
            const childStats = children.filter(c => !!c).map(c => ({ checked: c.checked, ...statsFor(c) }))
            output = {
                descendants: MoreMath.Sum(childStats.map(c => c.descendants > 0 ? c.descendants : 1 )),
                completed: MoreMath.Sum(childStats.map(c => c.checked ? (c.descendants || 1) : c.completed ))
            }
        }

        statCache[item._id] = output
        return output
    }

    try {

        // I know this might look like immutability sacrilege but doing this mutably means that we won't have to rewire
		// the other elements of the ItemState (byParent, byId, etc.)
        const out = items.map(i => {
			const { completed, descendants } = statsFor(i)
			i.descendants = descendants;
			i.completed = completed;
			return i;
		}) as Item[];
        return out

    } catch (e) {
		console.error('Failed to calculate statistics for items', e)
		return []
	}

}