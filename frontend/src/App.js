import React, { useState } from 'react';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profil from './pages/Profil';
import EditPost from './pages/EditPost';
import Post from './pages/Post';
import { ToastContainer } from 'react-toastify';
import AuthGard from './helpers/AuthGard';
import './styles/App.css';
import { hasAuthenticated } from './services/AuthApi';
import Auth from './contexts/Auth';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated());
  return (
    <Auth.Provider value={{ isAuthenticated, setIsAuthenticated }}>
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
            <Route path="/editPost/:id" element={<EditPost />} />
          </Route>
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
    </Auth.Provider>
  );
};

export default App;
