import React from 'react';
import { Outlet } from 'react-router';
import Header from '../../components/admin/Header';
import SideMenu from '../../components/admin/SideMenu';
import './admin.css';
const AdminLayout = () => {
  return (
    <div className="AdminLayout">
      <Header />
      <div id="admin">
        <SideMenu />
        <div id="admin_body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
