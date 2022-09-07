import React from 'react';
import { Outlet } from 'react-router';

const Dashboard = () => {
  return (
    <div className="Dashboard">
      SALUT !!!!
      <Outlet />
    </div>
  );
};

export default Dashboard;
