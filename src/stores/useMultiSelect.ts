import { create } from 'zustand'

type MultiSelectState = {

    isEnabled: boolean,
    itemIds: Set<string>,

    toggleItem: (itemId: string) => void

    start: (itemId?: string) => void
    stop: () => void

    itemIsSelected: (itemId: string) => boolean

}

export const useMultiSelect = create<MultiSelectState>((set, get) => {

    return {

        isEnabled: false,
        itemIds: new Set<string>(),

        toggleItem: (itemId: string) => {
            if (!get().isEnabled) return;
            const checked = get().itemIds.has(itemId)
            const newSet = checked
                ? new Set<string>(Array.from(get().itemIds).filter(i => i !== itemId))
                : new Set<string>([ ...Array.from(get().itemIds), itemId ]);

            const stillEnabled = newSet.size > 0
            set({ itemIds: newSet, isEnabled: stillEnabled })
        },

        start: (itemId?: string) => {
            if (get().isEnabled) return
            const initSet = new Set<string>(itemId ? [itemId] : [])
            set({ itemIds: initSet, isEnabled: true })
        },

        stop: (itemId?: string) => {
            if (!get().isEnabled) return
            set({ itemIds: new Set<string>([]), isEnabled: false })
        },

        itemIsSelected: (itemId: string) => get().itemIds.has(itemId)

    }

})