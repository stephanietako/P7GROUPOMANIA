import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export const FileUploader = () => {
  const [file, setFile] = useState();
  const { id } = useParams();

  const handleChange = (e) => {
    if (e.target.files.length !== 0) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }

    const data = new FormData();
    data.append('images', e.target.files[0]);
    data.append('name', 'Test Name');
    data.append('desc', 'Test description');

    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: data,
    };

    fetch(`http://localhost:5000/users/upload/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); //success
        alert('OK');
      })
      .catch((err) => {
        console.error(err); //error
        alert('An error occurred');
      });
  };
  return (
    <form action="" onSubmit={handleChange} className="file-uploader">
      <label htmlFor="file">Change Picture</label>
      <>
        <h1>Add Avatar</h1>
        <input type="file" name="file" onChange={handleChange} />
        <img id="imgAvatar" src={file} />
        <br />
        <input type="submit" value="Send" id="btn btn-primary" />
      </>
    </form>
  );
};

export default FileUploader;
