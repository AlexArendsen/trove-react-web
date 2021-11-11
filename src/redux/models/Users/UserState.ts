import { ApiData } from "../ApiData";
import { UserProfile } from "./UserProfile";

export class UserState {

	me: ApiData<UserProfile | null>

	constructor() {
		this.me = new ApiData(null);
	}

}