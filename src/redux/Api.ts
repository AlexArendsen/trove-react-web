import { ApiClient } from "../utils/ApiClient";

const Legacy =  new ApiClient('Legacy NuList API', 'https://nulist.app/api');
const Local =  new ApiClient('Local Trove API', 'http://192.168.0.172:8118/api');
const Trove2023 =  new ApiClient('Trove API', 'https://nulist.app/api');
const Trove2023Alt =  new ApiClient('Trove API', 'https://trove-api-n5wur.ondigitalocean.app/api');

export const Api = Local