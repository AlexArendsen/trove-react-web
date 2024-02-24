import { useEffect } from "react"
import { useMultiSelect } from "../../stores/useMultiSelect"
import { useItemEditor } from "../../stores/useItemEditor"

export const GlobalEventController = () => {

    const ms = useMultiSelect()
    const ed = useItemEditor()

    // Multiselect close
    useEffect(() => {

        const handler = (ev: KeyboardEvent) => {
            if (ev.key === 'Escape' && ms.isEnabled) ms.stop()
        }

        document.addEventListener('keydown', handler)
        return () => { document.removeEventListener('keydown', handler) }

    }, [ms.isEnabled, ms.stop])

    return null

}