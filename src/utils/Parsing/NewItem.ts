// Samples
// ----
// Go to the store --> { title: "Go to the store" }
// Get groceries #weekend #shopping --> { title: "Get groceries", data: { "_tags": [ "weekend", "shopping" ] } }
// Get groceries | Eggs, bread, milk, soap --> { title: "Get groceries", description: "Eggs, bread, milk, soap" }
// [x] Get groceries --> { title: "Get groceries", checked: true }
// Get groceries [planner] --> { title: "Get groceries", data: { "_lenses": ["planner"] } }

import { Item } from "../../redux/models/Items/Item"
import { GetFromStore } from "../GetFromStore"
import { MakeScanner } from "./Scanner"

/* Grammar

NewItem = [Checked] + Title + [{Modifier}] + [Descrition]
Checked = '[x]'
Modifier = Lens | Tag
Lens = '[' + Identifier + ']'
Tag = '#' + Identifier
Tag = '|' + string
 */

const modifierOrDescriptionCharacters = new Set<string>([ '[', '#', '|' ])
const ParseItemInner = (src: string): Item => {

    const s = MakeScanner(src)
    const out: Item = {
        _id: '',
        checked: false,
        title: src,
        user_id: GetFromStore(s => s.users.me.data?._id) || '',
        data: {}
    }

    const CheckedDeterminer = () => {
        if (s.isOnChar('[')) {
            s.scanChar('[')
            s.scanChar('x')
            s.scanChar(']')
            out.checked = true
        }
    }

    const Identifier = (): string => {
        let out = ''
        while (/[A-Za-z0-9\-]/.test(s.currentChar()) && !s.isPastEnd()) out += s.scanChar()
        return out
    }

    const Modifier = (): boolean => {

        // Lens determiner
        if (s.isOnChar('[')) {
            s.scanChar('[')
            s.skipWhitespace()
            if (!out.data._lenses) out.data._lenses = []
            out.data._lenses.push(Identifier())
            s.skipWhitespace()
            s.scanChar(']')

        // Tag determiner
        } else if (s.isOnChar('#')) {
            s.scanChar('#')
            if (!out.data._tags) out.data._tags = []
            out.data._tags.push(Identifier())
        } else {
            return false
        }

        return true

    }

    s.skipWhitespace()
    CheckedDeterminer()
    s.skipWhitespace()
    out.title = s.scanTo(modifierOrDescriptionCharacters).trim()
    while (Modifier()) {}
    s.skipWhitespace()
    if (s.isOnChar('|')) {
        s.scanChar('|')
        s.skipWhitespace()
        out.description = s.scanToEnd()
    }

    return out

}

const ParseItem = (src: string): Item => {
    try {
        const p = ParseItemInner(src)
        console.log('Parsed item!', p)
        return p
    } catch (e) {
        console.log('Failed to parse new item spec: ', e)
        return { _id: '', title: src, checked: false, user_id: '' }
    }
}

export const NewItem = {
    Parse: ParseItem
}