import axios, { AxiosError, Method } from 'axios';
import { GetToken } from './GetToken';

type StringObject = { [key: string]: string }

export class ApiClient {

    serviceName: string;
    baseUrl: string;
    headers: StringObject | undefined;
    queryParams: StringObject | undefined;

    constructor(serviceName: string, baseUrl: string, headers?: StringObject, queryParams?: StringObject) {
        this.serviceName = serviceName;
        this.baseUrl = baseUrl.trim().replace(/\/$/, '');
        this.headers = headers;
        this.queryParams = queryParams;
    }

    async send<TResult>(method: Method, url: string, body?: any, extraHeaders: StringObject = {}, queryParams: StringObject = {}) : Promise<TResult> {
        const queryString = Object.entries({ ...this.queryParams, ...queryParams }).map(([key, value]) => `${ key }=${ encodeURIComponent(value) }`).join('&')
        const fullUrl = `${ this.baseUrl }/${ url.trim().replace(/^\//, '') }?${ queryString }`;
        const token = (await GetToken()) || 'none'
        let headers = { ...this.headers, ...extraHeaders, 'Authorization': 'Bearer ' + token }
        try {
            //console.log(`${ this.serviceName }: > ${ method } [...] ${ fullUrl }`, body || '<no body>')
            const response = await axios.request({ url: fullUrl, method, headers, data: body })
            const responseBody = response.data as TResult;
            //console.log(`${ this.serviceName }: < ${ method } [${ response.status }] ${ fullUrl } sdfgsdfgd`)
            return responseBody;
        } catch (e: any) {
            const ax = e as AxiosError;
            //console.error(`${ this.serviceName }: < ${ method } [${ ax?.response?.status || -1 }] ${ fullUrl }: ${ e }`, JSON.stringify(ax?.response?.data || {}))
            throw new Error({ ...e, httpHint: ax?.response?.status || 500 })
        }
    }

    async get<TResult>(url: string, query?: StringObject, headers?: StringObject) { return this.send<TResult>('GET', url, null, headers, query) }
    async post<TResult>(url: string, body?: any, query?: StringObject, headers: StringObject = {}) { return this.send<TResult>('POST', url, body, { ...headers, 'Content-Type': 'application/json' }, query) }
    async put<TResult>(url: string, body?: any, query?: StringObject, headers?: StringObject) { return this.send<TResult>('PUT', url, body, headers, query) }
    async del<TResult>(url: string, body?: any, query?: StringObject, headers?: StringObject) { return this.send<TResult>('DELETE', url, body, headers, query) }

}