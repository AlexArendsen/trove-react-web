import { Actions } from "../actions/Actions";
import { ReduxAction } from "../models/ReduxAction";
import { UiState } from "../models/Ui/UiState";

export const UiReducer = (state: UiState = new UiState(), action: ReduxAction): UiState => {

	switch (action.type) {
		case Actions.Ui.SelectItem: return { selectedItem: action.data }
	}

	return state;

}