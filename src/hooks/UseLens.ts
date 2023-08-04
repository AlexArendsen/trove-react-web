import { create } from 'zustand'
import { DefaultLens } from '../lenses/DefaultLens'
import { Lens } from '../lenses/Lens'
import { RoutinesLens } from '../lenses/RoutinesLens'

export type LensStore = {
    current: Lens,
    set: (lens: Lens) => void
}

/**@deprecated use useLenses please */
export const useLens = create<LensStore>((set, get) => {

    return {
        current: DefaultLens,
        set: l => set({ current: l })
    }

})