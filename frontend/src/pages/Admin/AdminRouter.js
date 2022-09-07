import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout, Dashboard } from '../Admin';
import { User, UserEdit, UserAdd } from '../Admin/Users';
import { Post, PostEdit } from '../Admin/Posts';
import Error from '../../_utils/Error';

const AdminRouter = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="user">
          <Route path="index" element={<User />} />
          <Route path="edit" element={<UserEdit />} />
          <Route path="add" element={<UserAdd />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
