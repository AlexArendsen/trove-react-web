import { useItemStore } from "../stores/ItemStore/useItemStore";
import { useItem } from "./UseItem";
import { useQueryParams } from "./UseQueryParams";

export const useSelectedItem = () => {

	const queryParams = useQueryParams();
	const id = queryParams.item
	const { item, children } = useItem(id);
	const parent = useItemStore(s => item?.parent_id ? s.byId[item.parent_id] || null : null)
	const grandparent = useItemStore(s => parent?.parent_id ? s.byId[parent.parent_id] || null : null)

	return { item, parent, grandparent, children }
}