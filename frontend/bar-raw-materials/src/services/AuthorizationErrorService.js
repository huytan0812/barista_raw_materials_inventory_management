import { getLogout } from '../contexts/AuthContext';

export const handleAuthError = (err) => {
    if (err.response.status === 401) {
        const logout = getLogout();
        if (logout) {
            logout();
        }
    }
    return Promise.reject(err);
}