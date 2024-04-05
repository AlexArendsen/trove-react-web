import { create } from "zustand"
import { MoreMath } from "../utils/MoreMath"
import { useItemStore } from "./ItemStore/useItemStore"

export type LayoutStoreState = {

    generationsToShow: number
    setGenerationsToShow: (levels: number) => void

    sidebarVisible: boolean
    sidebarItemId: string | null
    setSidebarItemId: (id: string | null) => void
    toggleSidebar: () => void

}

export const useLayout = create<LayoutStoreState>((set, get) => {

    return {

        generationsToShow: 2,
        setGenerationsToShow: (levels) => set({ generationsToShow: MoreMath.Clamp(levels, 3, 0) }),

        sidebarVisible: false,
        sidebarItemId: null,
        setSidebarItemId: (id: string | null) => set({ sidebarItemId: id }),
        toggleSidebar: () => {
            if (get().sidebarVisible) set({ sidebarVisible: false })
            else if (!get().sidebarItemId) set({ sidebarItemId: useItemStore.getState().root?._id, sidebarVisible: true })
            else set({ sidebarVisible: true })
        }

    }

})