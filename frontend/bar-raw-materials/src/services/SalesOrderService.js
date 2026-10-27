import {default as axios} from 'axios'
import {handleAuthError} from './AuthorizationErrorService'
import { API_URL } from './apiConfig';

const axiosHTTP = axios.create(
    {
        baseURL: `${API_URL}/staff/salesOrder`,
        headers: {
            'Content-Type': 'application/json'
        }
    }
)

axiosHTTP.interceptors.request.use((config) => {
    config.params = {...config.params}
    return config;
})

axiosHTTP.interceptors.response.use(
    (response) => response, 
    (err) => {
        return handleAuthError(err);
    }
)

export default axiosHTTP;