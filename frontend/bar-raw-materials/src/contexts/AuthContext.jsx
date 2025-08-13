import { createContext, useContext, useState } from 'react';
import axiosHTTP from '../services/AuthService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const login = async(username, password) => {
        try {
            const response = await axiosHTTP.post('/login', {
                username: username,
                password: password,
                expiresInMins: 30,
            })
            setUser(response.data);
            setToken(response.data.accessToken);
        }
        catch (error) {
            console.log(error);
        }
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value = {{'user': user, 'token': token, 'login': login, 'logout': logout}}>
            { children }
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext);
}