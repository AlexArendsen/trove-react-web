import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { RootReducer } from "./reducers/RootReducer";

export const CreateStore = () => {

    const logger = createLogger({ collapsed: true })
    const middleware = [ logger, thunk ]

    const enhancer = compose(applyMiddleware(...middleware));

    return createStore(RootReducer, {}, enhancer)
}