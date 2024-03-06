import { create } from "zustand";
import { useItemStore } from "./ItemStore/useItemStore";

type MoveEditorState = {

    isLoading: boolean
    isOpen: boolean
    subjectIds: string[] | undefined
    targetId: string | undefined
    viewportParentId: string | undefined

    open: (itemId: string | string[]) => void
    close: () => void
    setTarget: (itemId: string) => void
    setViewportParent: (itemId: string) => void
    submitMove: () => Promise<{ success: boolean }>

    // TODO -- Child move mode
    // mode: 'self' | 'children'
    // subjectFilter: (item: Item) => boolean

}

export const useMoveEditor = create<MoveEditorState>((set, get) => {

    return {

        isLoading: false,
        isOpen: false,
        subjectIds: undefined,
        targetId: undefined,
        viewportParentId: undefined,

        open: (itemId: string | string[]) => {
            const firstId = Array.isArray(itemId) ? itemId[0] : itemId
            const idsList = Array.isArray(itemId) ? itemId : [itemId]
            set({
                isOpen: true,
                viewportParentId: get().viewportParentId || useItemStore.getState().byId[firstId]?.parent_id,
                subjectIds: idsList
            })
        },
        close: () => set({ isOpen: false }),
        setTarget: (itemId: string) => set({ targetId: itemId }),
        setViewportParent: (itemId: string) => set({ viewportParentId: itemId }),

        submitMove: async () => {

            set({ isLoading: true })
            let result = false

            try {

                const subjects = get().subjectIds
                const target = get().targetId
                if (subjects === undefined || !(subjects?.length) || target === undefined) {
                    console.error('Cannot move, no subject item(s) specified')
                } else {
                    useItemStore.getState().moveMany(subjects, target)
                    result = true
                }

            } catch (e) {
                console.error('Error while moving', e)
            }

            set({ isLoading: false })
            return { success: result }
        }

    }

})