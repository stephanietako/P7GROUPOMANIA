import React from 'react';
import '../styles/ImageError.css';
import image from '../assets/image/erreur-404.webp';

const Error = () => {
  return (
    <div className="error">
      <img src={image} className="error_img" alt=" 404 error" />
    </div>
  );
};

export default Error;
