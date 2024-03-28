import { create } from 'zustand'

type MultiSelectState = {

    isEnabled: boolean,
    itemIds: Set<string>,

    toggleItem: (itemId: string) => void

    selectItem: (itemId: string) => void
    deselectItem: (itemId: string) => void

    selectManyItems: (itemIds: string[]) => void
    deselectManyItems: (itemIds: string[]) => void

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

        selectItem: (itemId: string) => get().selectManyItems([itemId]),
        deselectItem: (itemId: string) => get().deselectManyItems([itemId]),

        selectManyItems: (itemIds: string[]) => {
            const newList = Array.from(get().itemIds).concat(itemIds)
            set({ itemIds: new Set(newList) })
        },

        deselectManyItems: (itemIds: string[]) => {
            const deselectSet = new Set(itemIds);
            const newList = Array.from(get().itemIds).filter(id => !deselectSet.has(id))
            const stillEnabled = newList.length > 0
            set({ itemIds: new Set(newList), isEnabled: stillEnabled })
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