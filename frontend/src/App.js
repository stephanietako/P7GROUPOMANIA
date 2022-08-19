import React from 'react';
import Layout from '@/pages/Layout';
import FileUploaded from '@/components/FileUploaded';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Profil from '@/pages/Profil';
import Post from '@/pages/Post';
import { ToastContainer } from 'react-toastify';
import AuthGard from './helpers/AuthGard';
import Error from '@/_utils/Error';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <AuthGard>
                <Home />
              </AuthGard>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profil"
            element={
              <AuthGard>
                <Profil />
              </AuthGard>
            }
          />
          <Route
            path="/post"
            element={
              <AuthGard>
                <Post />
              </AuthGard>
            }
          />
          <Route
            path="/fileUpload"
            element={
              <AuthGard>
                <FileUploaded />
              </AuthGard>
            }
          />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
