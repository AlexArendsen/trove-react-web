import { Item } from "../redux/models/Items/Item"
import { ItemState } from "../redux/models/Items/ItemState"
import { History as DomHistory } from 'history';

export interface Lens {

    // Home screen
    homeScreenLabel: string
    getHomeScreenItems: (state: ItemState) => Item[] // Allows lens to customize subtitle
    onAddTopLevelItem: (dispatch: any, history: DomHistory, title: string) => Promise<void>

    // Item editing
    renderItemEditor: (props: { itemId: string, onEditing: (editing: boolean) => void }) => JSX.Element

    // Checking
    onItemCheck?: (dispatch: any, item: Item) => Promise<void>
    onItemUncheck?: (dispatch: any, item: Item) => Promise<void>

}