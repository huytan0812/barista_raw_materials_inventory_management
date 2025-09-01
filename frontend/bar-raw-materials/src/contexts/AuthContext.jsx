import { createContext, useContext, useState } from 'react';
import axiosHTTP from '../services/AuthService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async(username, password) => {
        try {
            const response = await axiosHTTP.post('/login', {
                username: username,
                password: password,
                expiresInMins: 30,
            })
            setUser(response.data);
            setToken(response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.accessToken);
            setIsAuthenticated(true);
        }
        catch (error) {
            console.log(error);
        }
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    const verifyJWT = async() => {
        if (token) {
            console.log("Validating token...");
            try {
                if (!isAuthenticated) {
                    console.log("Sending a verify JWT request to server");
                    const response = await axiosHTTP.post('/verifyJWT', {
                        token: token
                    })
                    if (response.status === 200) {
                        if (!response.data.isTokenValid) {
                            console.log("Is token valid: ", response.data.isTokenValid);
                            logout();
                        }
                        else {
                            console.log("Token is valid");
                        }
                    }
                }
                else {
                    console.log("Already authenticated");
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <AuthContext.Provider 
            value = {{
                'user': user, 
                'token': token, 
                'login': login, 
                'logout': logout,
                'verifyJWT': verifyJWT,
                'isAuthenticated': isAuthenticated, 
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext);
}