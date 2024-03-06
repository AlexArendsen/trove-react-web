import { useItemStore } from "../stores/ItemStore/useItemStore";

export const useItem = (itemId?: string | null) => {

	const item = useItemStore(s => (itemId ? s.byId[itemId] || s.root : s.root) || null);
	const children = useItemStore(s => item ? s.byParent[item._id] : [])

	return { item, children }

}