import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const FileUploader = () => {
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('access_token');
  const [image, setImage] = useState({ preview: '', data: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', image.data);

    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    fetch(`http://localhost:5000/users/upload/${userId}`, requestOptions)
      .then((response) => response.json())
      .then(function () {
        toast.success('Your profile has been successfully changed.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/', { replace: true });
      })
      .catch((err) => {
        toast.error('An error occurred while changing your profile picture.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  };

  return (
    <>
      <h4>Change my avatar</h4>
      {image.preview && (
        <img src={image.preview} width="100" height="100" alt="avatar" />
      )}

      <form onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={handleFileChange}></input>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default FileUploader;
