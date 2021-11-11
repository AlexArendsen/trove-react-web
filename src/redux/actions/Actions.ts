import { ActionNames } from "../models/ActionNames";

export const Actions = {
	Authentication: {
		GetToken: new ActionNames('AUTH_GET_TOKEN'),
		LogOut: 'AUTH_LOG_OUT'
	},
	Items: {
		GetAll: new ActionNames('ITEMS_GET_ALL'),
		Add: new ActionNames('ITEMS_ADD'),
		Check: new ActionNames('ITEMS_CHECK'),
		Uncheck: new ActionNames('ITEMS_UNCHECK'),
		DeleteOne: new ActionNames('ITEMS_DEL_ONE'),
		DeleteMany: new ActionNames('ITEMS_DEL_MANY'),
		MoveOne: new ActionNames('ITEMS_MOVE_ONE'),
		MoveMany: new ActionNames('ITEMS_MOVE_MANY'),
		UpdateOne: new ActionNames('ITEMS_UPDATE_ONE'),
		Search: 'ITEMS_SEARCH'
	},
	User: {
		GetProfile: new ActionNames('USER_GET_PROFILE')
	},
	Ui: {
		SelectItem: 'SELECT_ITEM',
		SetDraggingItem: 'SET_DRAG_ITEM'
	}
}