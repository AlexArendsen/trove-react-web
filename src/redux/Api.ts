import { ApiClient } from "../utils/ApiClient";

const Legacy =  new ApiClient('Legacy NuList API', 'https://nulist.app/api');
const Local =  new ApiClient('Local Trove API', 'http://192.168.0.20:8118/api');
const Trove2023 =  new ApiClient('Trove API', 'https://nulist.app/api');

export const Api = Trove2023