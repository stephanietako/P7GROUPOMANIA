import React from 'react';
import Banner from './components/Banner';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profil from './pages/Profil';
import Post from './pages/Post';

const App = () => {
  return (
    <div className="App">
      <div>"Hello depuis App"</div>
      <Banner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/post" element={<Post />} />
        {/*  <Redirect to="/" element={<Home />} /> */}
      </Routes>
    </div>
  );
};

export default App;
