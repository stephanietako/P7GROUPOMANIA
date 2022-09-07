import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout, Dashboard } from '../Admin';

const AdminRouter = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
