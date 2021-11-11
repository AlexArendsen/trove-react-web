import { Actions } from "../actions/Actions";
import { Item } from "../models/Items/Item";
import { ItemState } from "../models/Items/ItemState";
import { ReduxAction } from "../models/ReduxAction";

export const ItemReducer = (state: ItemState = new ItemState(), action: ReduxAction): ItemState => {

	switch (action.type) {

		// Get Items
		case Actions.Items.GetAll.loading: return { ...state, all: state.all.startLoading([]), byId: {} }
		case Actions.Items.GetAll.success:
			let items = action.data as Item[]

			// Doing this iteratively because when you get like 10k+ items using .reduce becomes really expensive
			const byId: Record<string, Item> = {}; const byParent: Record<string, Item[]> = {}; const topLevel = [];
			for(const i of items)
			{
				byId[i._id] = i;
				if (i.parent_id) {
					if (!byParent[i.parent_id]) byParent[i.parent_id] = []
					byParent[i.parent_id].push(i)
				}
				else topLevel.push(i)
			}

			// Add in descendants and completed stats. Note that WithStats mutates the items in place,
			// meaning that we don't have to hook everyone back up to byId, byParent, etc.
			items = WithStats(items, byParent);

			return {
				...state,
				all: state.all.succeeded(items),
				byId, byParent, topLevel
			}
		case Actions.Items.GetAll.failure: return { ...state, all: state.all.failed(action.error) }

		// Check / Uncheck Item
		case Actions.Items.Check.loading: return WithItemUpdate(state, action.subject, i => ({ ...i, checked: true }))
		case Actions.Items.Check.failure: return WithItemUpdate(state, action.subject, i => ({ ...i, checked: false }))
		case Actions.Items.Uncheck.loading: return WithItemUpdate(state, action.subject, i => ({ ...i, checked: false }))
		case Actions.Items.Uncheck.failure: return WithItemUpdate(state, action.subject, i => ({ ...i, checked: true }))

		// Move Item(s)
		case Actions.Items.MoveOne.loading: return WithItemUpdate(state, action.subject.child, i => ({ ...i, parent_id: action.subject.newParent }))
		case Actions.Items.MoveOne.failure: return WithItemUpdate(state, action.subject.child, i => ({ ...i, parent_id: action.subject.oldParent }))

		// Add Item
		case Actions.Items.Add.loading: return WithNewItem(state, { _id: action.subject._id, user_id: '', checked: false, title: action.subject.title, parent_id: action.subject.parent_id })
		case Actions.Items.Add.success: return WithNewItem(WithoutItem(state, action.subject._id), action.data)
		case Actions.Items.Add.failure: return WithoutItem(state, action.subject._id)

		// Update Item
		case Actions.Items.UpdateOne.loading: return WithItemUpdate(state, action.subject.new._id, i => action.subject.new)
		case Actions.Items.UpdateOne.failure: return WithItemUpdate(state, action.subject.new._id, i => action.subject.old)

		// Delete Item
		case Actions.Items.DeleteOne.loading: return WithoutItem(state, action.subject._id)
		case Actions.Items.DeleteOne.failure: return WithNewItem(state, action.subject)

	}

	return state;

}

const WithItemUpdate = (originalState: ItemState, itemId: string, update: (data: Item) => Item) => {
	const original = originalState.byId[itemId]
	if (!original) return originalState;
	let state = { ...originalState }
	const updated = update({ ...original });

	state.byId = { ...state.byId, [ itemId ]: updated };
	state.all = state.all.succeeded(state.all.data?.map(i => i._id === itemId ? updated : i) || [ updated ])

	const oldParent = original.parent_id;
	const newParent = updated.parent_id;
	const moved = oldParent !== newParent;
	if (oldParent && !moved) state.byParent[oldParent] = state.byParent[oldParent].map(i => i._id === updated._id ? updated : i)

	// If we changed the checked status, update the item's parent
	if (original.checked !== updated.checked) state = RecalculateStats(state, itemId);

	// If we didn't move parents, don't move the item, just update the byParent lookup
	if (!moved) return state;

	// Otherwise, move the item and possible put it in the top-level list
	const Reparent = (parentId: string | undefined, action: 'add' | 'remove') => {
		if (!parentId) return;
		if (action === 'add') {
			if (!state.byParent[parentId]) state.byParent[parentId] = [ updated ]
			else state.byParent[parentId] = state.byParent[parentId] = [ ...state.byParent[parentId], updated ]
		} else {
			if (!state.byParent[parentId]) state.byParent[parentId] = []
			else state.byParent[parentId] = state.byParent[parentId].filter(i => i._id !== itemId)
		}
	}

	const SetTopLevel = (action: 'add' | 'remove') => {
		if (!state.topLevel) state.topLevel = [];
		if (action === 'add') state.topLevel.push(updated);
		else state.topLevel = state.topLevel.filter(i => i._id !== itemId);
	}

	Reparent(oldParent, 'remove');
	if (!newParent) SetTopLevel('add')
	else if (!oldParent) SetTopLevel('remove')
	if (newParent) Reparent(newParent, 'add')

	// After moving, update the stats for the item's old and new parents
	state = RecalculateStats(RecalculateStats(state, newParent), oldParent)

	return state;

}

const WithNewItem = (originalState: ItemState, item: Item) => {

	const state = { ...originalState }
	const id = item._id; const parent = item.parent_id;

	state.all = state.all.succeeded([ ...(state.all.data || []), item ])
	state.byId[id] = item;
	if (parent) {
		if (!state.byParent[parent]) state.byParent[parent] = [ item ]
		else state.byParent[parent] = [ ...state.byParent[parent], item ] 
	} else {
		state.topLevel = [ ...state.topLevel, item ]
	}

	return RecalculateStats(state, parent)

}

const WithoutItem = (originalState: ItemState, itemId: string) => {

	const state = { ...originalState }
	const i = state.byId[itemId];
	console.info({ me: 'withoutItem', itemId, found: i })
	if (!i) return state;

	state.all = state.all.succeeded((state.all.data || []).filter(i => i._id !== itemId))
	delete state.byId[itemId];
	if (i.parent_id) state.byParent[i.parent_id] = state.byParent[i.parent_id].filter(i => i._id !== itemId);
	else state.topLevel = state.topLevel.filter(i => i._id !== itemId);

	return RecalculateStats(state, i.parent_id);

}

type StatBundle = { descendants: number, completed: number }
const WithStats = (items: Item[], byParent: Record<string, Item[]>): Item[] => {

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
                descendants: Sum(childStats.map(c => c.descendants > 0 ? c.descendants : 1 )),
                completed: Sum(childStats.map(c => c.checked ? (c.descendants || 1) : c.completed ))
            }
        }

        statCache[item._id] = output
        return output
    }

    try {

        // I know this might look like immutability sacrilege but doing this mutably means that we won't have to rewire
		// the other elements of the ItemState (byParent, byId, etc.)
        const out = WithoutOrphans(items, byParent).map(i => {
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

// We don't want to waste our time with unnavigable items, or worse, items that form a loop
// Removing all items who are not descendants of the top-level items is an effective way to
// take care of this problem.
const WithoutOrphans = (items: Item[], byParent: Record<string, Item[]>) => {

	const found = new Set<string>();
	const topLevelItems = items.filter(i => !i.parent_id);
	const markChildren = (item: Item) => {
		found.add(item._id);
		byParent[item._id]?.forEach(x => markChildren(x));
	}
	topLevelItems.forEach(markChildren);
	return items.filter(i => found.has(i._id));

}

const RecalculateStats = (state: ItemState, startId?: string) => {

	let newState = { ...state };

	// Recursive runner:
	// 1. Update this item's completed + descendant figures
	// 2. If the item has a parent, bubble up to them and do the same thing
	const crunch = (item: Item) => {
		if (!item) return;
		console.info({ me: 'crunch', item: item.title })
		const c = state.byParent[item._id];
		if (c) {
			newState = WithItemUpdate(newState, item._id, i => {
				i.descendants = Sum(c.map(x => x.descendants || 1))
				i.completed = Sum(c.map(x => x.checked ? (x.descendants || 1) : x.completed || 0))
				return i;
			})
		}
		if (item.parent_id) crunch(state.byId[item.parent_id])
	}

	if (startId) crunch(state.byId[startId]);

	return newState;

}

const Sum = (nums: number[]) => (nums || []).reduce((sum, next) => sum + next, 0);