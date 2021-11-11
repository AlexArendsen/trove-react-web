import { ApiData } from "../ApiData";
import { Token } from "./Token";

export class AuthenticationState {
	token: ApiData<Token | null>

	constructor() {
		this.token = new ApiData(null);
	}
}