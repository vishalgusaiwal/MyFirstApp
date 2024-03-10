import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './auth-helper';


const PrivateRoute = () => {
    const ause = isAuthenticated();
    return ause ? <Outlet /> : <Navigate to='/signin' />;
}
export default PrivateRoute;