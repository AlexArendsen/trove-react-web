import { AddItemAction } from "../redux/actions/ItemActions";
import { DefaultItemEditor } from "../screens/ItemsScreen/SelectedItemDisplay/SelectedItemDisplay";
import { Lens } from "./Lens";

export const DefaultLens: Lens = {
    getHomeScreenItems: (state) => state.topLevel,
    homeScreenLabel: 'Home',
    onAddTopLevelItem: async (dispatch, _, title) => {
        await dispatch(AddItemAction(title, null))
    },
    renderItemEditor: ({itemId}) => <DefaultItemEditor itemId={ itemId } />
}