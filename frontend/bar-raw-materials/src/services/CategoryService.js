import { default as axios } from 'axios';

const axiosHTTP = axios.create(
    {
        baseURL:"http://localhost:8080/api/staff/category",
        headers: {
            "Content-Type": "application/json"
        }
    }
)

axiosHTTP.interceptors.request.use((config) => {
    return config;
})

axiosHTTP.interceptors.response.use((response) => {
    return response;
})

export default axiosHTTP;