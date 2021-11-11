import { AuthenticationState } from "./Authentication/AuthenticationState";
import { ItemState } from "./Items/ItemState";
import { UiState } from "./Ui/UiState";
import { UserState } from "./Users/UserState";

export class GlobalState {

    authentication: AuthenticationState
    items: ItemState
    users: UserState
    ui: UiState

    constructor() {
        this.authentication = new AuthenticationState();
        this.items = new ItemState();
        this.users = new UserState();
        this.ui = new UiState();
    }

}