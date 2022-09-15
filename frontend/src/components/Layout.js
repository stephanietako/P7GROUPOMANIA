import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <main className="App">
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
