import { default as axios } from 'axios';
import { getLogout } from '../contexts/AuthContext';

const axiosHTTP = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosHTTP.interceptors.request.use((config) => {
    return config
})

axiosHTTP.interceptors.response.use(
    (response) => response, 
    (err) => {
        if (err.response.status === 401) {
            const logout = getLogout();
            if (logout) {
                logout();
            }
        }
        return Promise.reject(err);
    }
)

export default axiosHTTP;