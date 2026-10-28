import { Result } from 'antd';
import { useAuthContext } from '../contexts/AuthContext.jsx';

// Hides admin-only pages from other roles; the backend enforces the same rule on the API
const AdminRoute = ({ children }) => {
    const { user } = useAuthContext();

    return (
        user?.role === 'admin'
            ? children
            : <Result status="403" title="403" subTitle="Bạn không có quyền truy cập trang này" />
    )
}

export default AdminRoute
