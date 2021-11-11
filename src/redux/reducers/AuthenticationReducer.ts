import { Actions } from "../actions/Actions";
import { AuthenticationState } from "../models/Authentication/AuthenticationState";
import { ReduxAction } from "../models/ReduxAction";

export const AuthenticationReducer = (state: AuthenticationState = new AuthenticationState(), action: ReduxAction): AuthenticationState => {

	switch (action.type) {
		case Actions.Authentication.GetToken.loading: return { ...state, token: state.token.startLoading() }
		case Actions.Authentication.GetToken.success: return { ...state, token: state.token.succeeded(action.data) }
		case Actions.Authentication.GetToken.failure: return { ...state, token: state.token.failed(action.error) }
		case Actions.Authentication.LogOut: return { ...state, token: state.token.succeeded(null) }
	}

	return state;

}