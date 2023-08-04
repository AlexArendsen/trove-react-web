import { useEffect } from "react";
import { useStore } from "./UseStore";

export const useItem = (itemId?: string | null) => {

	const item = useStore(s => itemId ? s.items.byId[itemId] : null);
	const children = useStore(s => itemId && item ? s.items.byParent[itemId] : [])

	return { item, children }

}