import React from 'react';
import { Outlet } from 'react-router';

const Dashboard = () => {
  return (
    <div className="Dashboard">
      SALUT DASHBOARD !!!!
      <Outlet />
    </div>
  );
};

export default Dashboard;
