import { Auth0ContextInterface } from "@auth0/auth0-react";
import { GetToken, SetTokenResolver } from "./utils/GetToken";
import { Auth0Constants } from "./constants/Auth0";
import { Store } from "redux";
import { ReduxAction } from "./redux/models/ReduxAction";
import { SetConfig } from "./utils/Config";
import axios from "axios";

export const Initialize = async (config: {
    auth0: Auth0ContextInterface,
    store: Store<any, ReduxAction> & { dispatch: any }
}) => {

    const { auth0, store } = config

    SetTokenResolver(async () => {
        try {
            const token = await auth0.getAccessTokenSilently({
                authorizationParams: {
                    domain: `https://${Auth0Constants.domain}/api/v2`,
                    scope: 'read:current_user',
                    audience: 'https://nulist.app/api'
                }
            })

            return token
        } catch (e) {
            console.log('ERROR GETTING TOKEN!!', e)
            return ''
        }
    })

    // Configure Axios
    axios.interceptors.request.use(async (request) => {

        const jwt = await GetToken()
        if (!jwt) return request

        if (!request.headers) request.headers = {}
        request.headers['Authorization'] = `Bearer ${jwt}`
        return request

    })

    SetConfig({ Store: store })

}