import { message } from 'antd';
import { getLogout } from '../contexts/AuthContext';
import { getErrorMessage } from './apiErrors';

export const handleAuthError = (err) => {
    const status = err.response?.status;
    if (status === 401) {
        const logout = getLogout();
        if (logout) {
            logout();
        }
    }
    else if (status === 403) {
        // the user is logged in but their role may not perform this action
        message.error(getErrorMessage(err, 'Bạn không có quyền thực hiện thao tác này'));
    }
    return Promise.reject(err);
}