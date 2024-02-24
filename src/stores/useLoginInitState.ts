import { create } from "zustand";

type LoginInitStatus = 'Unloaded' | 'Loading' | 'Ready'
type LoginInitState = {
    status: LoginInitStatus
    setStatus: (status: LoginInitStatus) => void
}

export const useLoginInitState = create<LoginInitState>((set, get) => {

    return {
        status: 'Unloaded',
        setStatus: (s) => set({ status: s })
    }

})