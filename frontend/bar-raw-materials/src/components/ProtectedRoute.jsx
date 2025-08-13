import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuthContext();

    return (
        token ? children : <Navigate to='/login' replace />
    )
}

export default ProtectedRoute