import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const RequireAuth = ({ allowedRoles }) => {
    const  user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();
    return (
        allowedRoles?.includes(user?.role)
            ? <Outlet />
            : user?.userId !== null
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;