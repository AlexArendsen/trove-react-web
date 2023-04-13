import { DataPlan } from "../../utils/DataPlan/DataPlan";
import { Api } from "../Api";
import { Actions } from "./Actions";

export const GetCurrentUserProfileAction = () => new DataPlan('user:profile')
    .withReduxActions(Actions.User.GetProfile).do(() => Api.get('/me')).run();
