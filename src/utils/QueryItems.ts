import { getConfig } from "@testing-library/react";
import { Item } from "../redux/models/Items/Item"
import { GetConfig } from "./Config"

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

    static fromTql: (tql: string) => {

    }

    constructor() {
        this.match = null
    }
}
