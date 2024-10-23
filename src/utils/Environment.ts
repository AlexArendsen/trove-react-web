const GetEnvironment = () => {
    if (/(localhost|192\.168\..*)/.test(window.location.href)) {
        if (window.location.protocol === 'https:') return 'local-secure'
        else return 'local'
    } else {
        return 'production'
    }
}

export const Environment = {

    get: GetEnvironment,

    getApiBaseUrl: () => {
        const env = GetEnvironment()
        switch (env) {
            case 'local': return 'http://192.168.0.187:8118/api'
            case 'local-secure': return 'https://192.168.0.187:8118/api'
            default: return 'https://trove-api-b8e4ae538477.herokuapp.com/api'
        }
    }

}