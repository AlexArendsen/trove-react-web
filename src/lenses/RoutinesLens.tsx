import { AddItemAction } from "../redux/actions/ItemActions";
import { Item } from "../redux/models/Items/Item";
import { GetConfig } from "../utils/Config";
import { ItemQuery } from "../utils/QueryItems";
import { DefaultLens } from "./DefaultLens";
import { Lens } from "./Lens";

export const RoutinesLens: Lens = {

    homeScreenLabel: 'Today',

    getHomeScreenItems: () => { return getRoutines() },

    onAddTopLevelItem: async (dispatch, history, title) => {
        const r = getRoot()
        if (!!r) dispatch(AddItemAction(title, r._id))
    },

    renderItemEditor: DefaultLens.renderItemEditor,

    onItemCheck: async (dispatch: any, item: Item) => {

        // Check if item is a routine or sub-item
        // QueryItems(q => q.get('System').get('Plugins').get('Routines'))

        // Unpack item JSON
        // Determine new deadline
        // Update JSON body
        // Update the item in the API
    }

}

const getRootQuery = () => new ItemQuery().get(/System/).get('Plugins').get('Routines')
const getRoot = () => getRootQuery().match
const getRoutines = () => getRootQuery().getChildren();