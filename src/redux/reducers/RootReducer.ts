import { combineReducers } from "redux";
import { AuthenticationReducer } from "./AuthenticationReducer";
import { ItemReducer } from "./ItemsReducer";
import { UiReducer } from "./UiReducer";
import { UserReducer } from "./UserReducer";

export const RootReducer = combineReducers({
	authentication: AuthenticationReducer,
	items: ItemReducer,
	users: UserReducer,
	ui: UiReducer
})