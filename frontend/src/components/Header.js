import React from 'react';
import '@/styles/Header.css';
import Navbar from '@/components/Navbar';
const Header = () => {
  return (
    <div className="Header">
      <Navbar />
      <header className="App-header">SALUT HEADER !!!!!!!!!</header>
    </div>
  );
};

export default Header;
//<img src={logo} className="App-logo" alt="logo" id="logo" />
