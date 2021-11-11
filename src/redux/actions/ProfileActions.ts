import { DataPlan } from "../../utils/DataPlan/DataPlan";
import { Legacy } from "../LegacyApi";
import { Actions } from "./Actions";

export const GetCurrentUserProfileAction = () => new DataPlan('user:profile')
    .withReduxActions(Actions.User.GetProfile).do(() => Legacy.get('/me')).run();
