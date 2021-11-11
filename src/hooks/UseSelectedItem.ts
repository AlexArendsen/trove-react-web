import { useItem } from "./UseItem";
import { useQueryParams } from "./UseQueryParams";
import { useStore } from "./UseStore"

export const useSelectedItem = () => {

	const queryParams = useQueryParams();
	const id = queryParams.item
	const { item, children } = useItem(id);
	const parent = useStore(s => item?.parent_id ? s.items.byId[item.parent_id] || null : null)
	const grandparent = useStore(s => parent?.parent_id ? s.items.byId[parent.parent_id] || null : null)

	return { item, parent, grandparent, children }
}