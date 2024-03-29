import { useMemo, useState } from "react";
import { LensConfiguration } from "../components/ItemEditor/ItemEditorNewLensPage";
import { useItem } from "./UseItem";
import { DefaultItemLens } from "../lenses/DefaultItemLens";
import { OrphansLens } from "../lenses/OrphansLens";
import { PlannerItemLens } from "../lenses/PlannerItemLens";
import { SagaLens } from "../lenses/SagaItemLens";
import { DocumentsItemLens } from "../lenses/DocumentItemLens";
import { GridLens } from "../lenses/GridLens";
import { LayoutItemLens } from "../lenses/LayoutLens/LayoutItemLens";
import { DebugItemLens } from "../lenses/DebugItemLens";

export const allLenses = [
    DefaultItemLens,
    PlannerItemLens,
    SagaLens,
    DocumentsItemLens,
    GridLens,
    LayoutItemLens,
    OrphansLens,
    DebugItemLens
]

export const useItemLensIndex = (itemId: string) => useItem(itemId)?.item?.data?.__lenses as LensConfiguration[]
export const useItemLensData = <TData>(itemId: string, lensId: string) => useItem(itemId)?.item?.data?.[`__lens${lensId}`] as TData

type useItemSelectedLensReturn = [string | null, (lensId: string) => void]
export const useItemSelectedLens = (itemId?: string) => {

    const key = `item:${itemId}:default-lens`
    const [val, setVal] = useState(localStorage.getItem(key))

    return useMemo(() => {

        const handleUpdate = (lensId: string) => {
            localStorage.setItem(key, lensId)
            setVal(lensId)
        }

        if (!itemId) return [null, () => { }] as useItemSelectedLensReturn
        return [val, handleUpdate] as useItemSelectedLensReturn

    }, [itemId, val])

}