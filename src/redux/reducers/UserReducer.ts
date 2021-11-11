import { Actions } from "../actions/Actions";
import { UserState } from "../models/Users/UserState";
import { ReduxAction } from "../models/ReduxAction";

export const UserReducer = (state: UserState = new UserState(), action: ReduxAction): UserState => {

	switch (action.type) {

		// Get Profile
		case Actions.User.GetProfile.loading: return { ...state, me: state.me.startLoading() }
		case Actions.User.GetProfile.success: return { ...state, me: state.me.succeeded(action.data) }
		case Actions.User.GetProfile.failure: return { ...state, me: state.me.failed(action.error) }

	}

	return state;

}