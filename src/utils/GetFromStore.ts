import { GlobalState } from "../redux/models/GlobalState"
import { GetConfig } from "./Config"

export const GetFromStore = <TResult>(selector: (state: GlobalState) => TResult): TResult | null => {
    const store = GetConfig().Store
    return store ? selector(store.getState()) : null
}