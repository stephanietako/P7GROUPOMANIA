import React from 'react';
import '../styles/Footer.css';
import icon from '../assets/icon/icon.png';
const Footer = () => {
  return (
    <div>
      <div className="footer">
        <footer className="app_footer">
          {' '}
          <p>GROUPOMANIA NETWORK CORPORATION 2022</p>
          <img src={icon} className="app_icon" alt="icon groupomania" />
        </footer>
      </div>
    </div>
  );
};

export default Footer;
