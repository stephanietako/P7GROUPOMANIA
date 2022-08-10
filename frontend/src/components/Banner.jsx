import logo from '../assets/logo192.png';
import '../styles/Banner.css';
import React from 'react';

function Banner() {
  const title = 'Groupomania';
  return (
    <div className="groupomania-banner">
      <img src={logo} alt="Groupomania" className="groupomania-logo" />
      <h1 className="Groupomania">{title}</h1>
    </div>
  );
}

export default Banner;
