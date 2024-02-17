import { create } from "zustand";
import { GetConfig } from "../utils/Config";
import { MoveOneItemAction } from "../redux/actions/ItemActions";
import { getConfig } from "@testing-library/react";

type MoveEditorState = {

    isLoading: boolean
    isOpen: boolean
    subjectId: string | undefined
    targetId: string | undefined
    viewportParentId: string | undefined

    open: (itemId: string) => void
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
        subjectId: undefined,
        targetId: undefined,
        viewportParentId: undefined,

        open: (itemId: string) => set({
            isOpen: true,
            subjectId: itemId,
            viewportParentId: GetConfig().Store?.getState().items.byId[itemId]?.parent_id
        }),
        close: () => set({ isOpen: false }),
        setTarget: (itemId: string) => set({ targetId: itemId }),
        setViewportParent: (itemId: string) => set({ viewportParentId: itemId }),

        submitMove: async () => {

            set({ isLoading: true })
            let result = false

            try {
                const dispatch = GetConfig().Store?.dispatch as any;

                const subject = get().subjectId
                const target = get().targetId
                if (subject === undefined || target === undefined) {
                    console.error('Cannot move, no subject item specified')
                } else {
                    await dispatch(MoveOneItemAction(subject, target))
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