import { useMemo } from 'react'
import { DefaultItemLens } from '../lenses/DefaultItemLens'
import { ItemLens, ItemLensItemSpec } from '../lenses/ItemLens'
import { PlannerItemLens } from '../lenses/PlannerItemLens'
import { TaskItemLens } from '../lenses/TaskItemLens'
import { useItem } from './UseItem'
import { GridLens } from '../lenses/GridLens'
import { OrphansLens } from '../lenses/OrphansLens'
import { DebugItemLens } from '../lenses/DebugItemLens'

export const allLenses = [
    TaskItemLens,
    PlannerItemLens,
    GridLens,
    OrphansLens,
    DebugItemLens
]
const defaultLens = DefaultItemLens

export const useLenses = (itemId?: string): ItemLensItemSpec[] => {

    const { item } = useItem(itemId)
    const parent = useItem(item?.parent_id || null).item
    return useMemo(() => {

        if (!item) return [ defaultLens?.Default ] as ItemLensItemSpec[]

        const selfLens = allLenses.find(l => l.Test?.(item))
        const parentLens = parent ? allLenses.find(l => l.Test?.(parent)) : undefined

        return [ selfLens?.Self, parentLens?.Children, defaultLens?.Default ].filter(x => !!x) as ItemLensItemSpec[]

    }, [ itemId ])

}
