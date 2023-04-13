import { StorageKeys } from "../../constants/StorageKeys";
import { DataPlan } from "../../utils/DataPlan/DataPlan";
import { Api } from "../Api";
import { Token } from "../models/Authentication/Token";
import { Actions } from "./Actions";

export const GetStoredToken = () => localStorage.getItem(StorageKeys.LoginToken);

export const GetTokenAction = (username: string, password: string) => new DataPlan<Token>('login')
    .withReduxActions(Actions.Authentication.GetToken)
    .do(() => Api.post('/login', { username, password }))
    .withDataHandler((t: Token) => {
        localStorage.setItem(StorageKeys.LoginToken, t.token);
        return t;
    })
    .run();

export const LogOutAction = () => {
    localStorage.removeItem(StorageKeys.LoginToken);
    return ({ type: Actions.Authentication.LogOut })
}