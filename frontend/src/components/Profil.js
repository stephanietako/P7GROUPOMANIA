import React from 'react';
import { useState } from 'react';
import FileUploaded from '@/FileUploaded';

export const Form = (profil) => {
  const [firstName, setfirstName] = useState('');
  const { id } = profil;
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem('access_token');

  const submitForm = () => {
    let requestOptions = {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    fetch(`http://localhost:5000/users/upload/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        alert('uploaded successfully');
      })
      .catch((err) => {
        console.error(err); //error
        alert('An error occurred while apload file');
      });
  };

  return (
    <div className="Profil">
      <form>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setfirstName(e.target.value)}
        />
        <FileUploaded
          onFileSelectSuccess={(file) => setSelectedFile(file)}
          onFileSelectError={({ error }) => alert(error)}
        />

        <input
          type="file"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button onClick={submitForm}>Submit</button>
      </form>
    </div>
  );
};

export default Form;
