import { useMemo } from "react"
import { Item } from "../redux/models/Items/Item"

export const useSortedItems = (items: Item[], options?: Partial<{
    disableSort: boolean
}>) => {
    return useMemo(() => {
        if (options?.disableSort) return items
        return items?.sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity)) || []
    }, [ items ])
}