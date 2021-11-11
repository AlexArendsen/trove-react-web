import { useEffect } from "react";
import { useStore } from "./UseStore";

export const useItem = (itemId: string | null) => {

	const item = useStore(s => itemId ? s.items.byId[itemId] : null);
	const children = useStore(s => itemId && item ? s.items.byParent[itemId] : [])

	useEffect(() => console.info(`Item ${ item?.title } has been updated`), [ item ])

	return { item, children }

}