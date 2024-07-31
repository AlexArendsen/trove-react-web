import { create } from "zustand"

export type ThemeName = 'light' | 'dark'
type ThemeState = {
    theme: ThemeName
    load: () => void
    set: (theme: ThemeName) => void
}

export const useTheme = create<ThemeState>((set, get) => {
    return {
        theme: 'dark',
        load: () => {
            set({theme: localStorage.getItem('theme') || 'dark' as any })
        },
        set: (theme) => {
            localStorage.setItem('theme', theme)
            set({theme})
        }
    }
})