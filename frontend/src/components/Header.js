import React from 'react';
import '../styles/Header.css';
import Navbar from '../components/Navbar';
import logo from '../assets/logo/logo.svg';

const Header = () => (
  <div className="header">
    <Navbar />
    <header className="app_header">
      <img src={logo} className="app_logo" alt="logo groupomania" />
    </header>
  </div>
);

export default Header;
