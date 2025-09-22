import {default as axios} from 'axios'

const axiosHTTP = axios.create(
    {
        baseURL: 'http://localhost:8080/api/staff/customer',
        headers: {
            'Content-Type': 'application/json'
        }
    }
)

axiosHTTP.interceptors.request.use((config) => {
    config.params = {...config.params}
    return config;
})

axiosHTTP.interceptors.response.use((response) => {
    return response;
})

export default axiosHTTP;