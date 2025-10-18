import {default as axios} from 'axios'
import {handleAuthError} from './AuthorizationErrorService'

const axiosHTTP = axios.create(
    {
        baseURL: 'http://localhost:8080/api/staff/grnItem',
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