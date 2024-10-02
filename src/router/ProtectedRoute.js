import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { user } = useContext(AuthContext);

    // Nếu không có user (chưa đăng nhập), chuyển hướng đến trang đăng nhập
    if (!user) {
        // Nếu không có allowedRoles (cho phép khách), trả về element
        if (!allowedRoles) {
            return element;
        }
        return <Navigate to="/login" />;
    }

    // Nếu user không có role phù hợp, chuyển hướng về trang khác (ví dụ: trang Home)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/error" />; // Chuyển hướng đến trang lỗi nếu không có quyền
    }

    // Nếu có role phù hợp, trả về component tương ứng
    return element;
};

export default ProtectedRoute;
