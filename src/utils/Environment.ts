const GetEnvironment = () => {
    return /localhost/.test(window.location.href) ? 'local' : 'production'
}

export const Environment = {

    get: GetEnvironment,

    getApiBaseUrl: () => {
        const env = GetEnvironment()
        if (env === 'local') return 'http://192.168.0.85:8118/api'
        else return 'https://trove-api-n5wur.ondigitalocean.app/api'
    }

}