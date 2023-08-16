import { getConfig } from "@testing-library/react";
import { Item } from "../redux/models/Items/Item"
import { GetConfig } from "./Config"
import { Path, PathAstNode } from "./Parsing/Path";
import { GetFromStore } from "./GetFromStore";

/**@deprecated Please use QueryItems */
export class ItemQuery {
    match: Item | null | undefined

    get(name: string | RegExp) {

        if (this.match === undefined) return this;

        const candidates = (!this.match)
            ? GetConfig().Store?.getState().items.topLevel
            : GetConfig().Store?.getState().items.byParent[this.match._id]

        this.match = candidates?.find(c => {
            if (typeof name === 'string') return c.title === name
            return name.test(c.title)
        })

        return this;
    }

    getChildren() {
        if (!this.match) return []
        return GetConfig().Store?.getState().items.byParent[this.match?._id] || []
    }

    constructor() {
        this.match = null
    }
}

export type ItemQueryResult = Item | Item[] | number 
export const QueryItems = (src: string | PathAstNode[], options?: Partial<{
    rootId: string
}>): ItemQueryResult => {

    const ast = Array.isArray(src) ? src : Path.Parse(src)

    if (!ast.length) return []

    let match: Item[] = []

    let candidates: Item[] = GetFromStore(s => s.items.topLevel) || []
    if (options?.rootId) candidates = GetFromStore(s => s.items.byParent[options?.rootId || '']) || []

    for(const n of ast)
    {
        //if (n.type === 'identifier') {
            //match = [candidates.find(c => n.data[0] === c.title)].filter(x => !!x) as Item[]
        //} else if (n.type === 'choice') {
        if (n.type === 'literal') {
            match = [candidates.find(c => n.literal === c.title)].filter(x => !!x) as Item[]
        } else if (n.type === 'pattern') {
            if (!n.regex) match = candidates
            else match = candidates.filter(c => n.regex?.test(c.title) || false)
        }
        candidates = match.flatMap(m => GetFromStore(s => s.items.byParent[m._id]) || [])
    }

    return match;

}
