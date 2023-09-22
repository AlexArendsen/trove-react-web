import { useMemo } from "react"
import { Item } from "../redux/models/Items/Item"

export const useSortedItems = (items: Item[]) => {
    return useMemo(() => items?.sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity)) || [], [ items ])
}