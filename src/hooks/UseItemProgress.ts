import { useMemo } from "react";
import { Item } from "../redux/models/Items/Item";

export const useItemProgress = (item: Item | null | undefined) => {
	return useMemo(() => {
		if (item) return item.checked ? 1 : (item.completed || 0) / (item.descendants || 1)
		return 0;
	}, [ item, item?.completed, item?.descendants ])
}