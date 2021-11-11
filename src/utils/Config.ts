import { Store } from "redux"
import { GlobalState } from "../redux/models/GlobalState";

export interface GlobalConfig {

	Store: Store<GlobalState>

}

let config: Partial<GlobalConfig> = {};

export const GetConfig = () => config;

export const SetConfig = (update: Partial<GlobalConfig>) => config = { ...config, ...update }