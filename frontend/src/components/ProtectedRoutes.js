import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';

const useAuth = () => {
  const user = localStorage.getItem('user_role');
  if (user === 'true') {
    return {
      auth: 'true',
      role: user.role,
    };
  } else {
    return {
      auth: 'false',
      role: 'null',
    };
  }
};

const ProtectedRoutes = () => {
  const [userRole, setUserRole] = useState({ role: 'true' || 'false' });
  const { auth } = useAuth();

  if (userRole === 'true') {
    setUserRole();
    return auth ? <Outlet /> : <Navigate to="/admin" />;
  } else {
    return auth ? <Outlet /> : <Navigate to="/" />;
  }
};

export default ProtectedRoutes;
