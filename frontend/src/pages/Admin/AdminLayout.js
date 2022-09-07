import React from 'react';
import { Outlet } from 'react-router';

const AdminLayout = () => {
  return (
    <div className="AdminLayout">
      Layout Admin
      <Outlet />
    </div>
  );
};

export default AdminLayout;
