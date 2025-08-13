import { default as axios } from 'axios';

const axiosHTTP = axios.create({
    baseURL: "http://localhost:8080/api/auth/login",
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosHTTP.interceptors.request.use((config) => {
    return config
})

axiosHTTP.interceptors.response.use((response) => {
    const data = response.data;
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data));
    return response
})

export default axiosHTTP;