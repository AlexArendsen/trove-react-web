import { Item } from "../redux/models/Items/Item";
import { useItemStore } from "../stores/ItemStore/useItemStore";
import { useItem } from "./UseItem";
import { GetQueryParams, useQueryParams } from "./UseQueryParams";

type SelectedItemContext = {
	item: Item | null,
	parent: Item | null,
	grandparent: Item | null,
	children: Item[]
}

export const useSelectedItem = (): SelectedItemContext => {

	const queryParams = useQueryParams();
	const id = queryParams.item
	const { item, children } = useItem(id);
	const parent = useItemStore(s => item?.parent_id ? s.byId[item.parent_id] || null : null)
	const grandparent = useItemStore(s => parent?.parent_id ? s.byId[parent.parent_id] || null : null)

	return { item, parent, grandparent, children }
}

export const GetSelectedItem = (): SelectedItemContext => {

	const queryParams = GetQueryParams()
	const id = queryParams.item
	const item = useItemStore.getState().byId[id] || null
	const children = useItemStore.getState().byParent[id] || []
	const parent = item?.parent_id ? useItemStore.getState().byId[item.parent_id] || null : null
	const grandparent = parent?.parent_id ? useItemStore.getState().byId[parent.parent_id] || null : null
	return { item, children, parent, grandparent }

}