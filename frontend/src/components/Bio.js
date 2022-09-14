import React from 'react';
import { useState } from 'react';

const BioText = () => {
  const token = localStorage.getItem('access_token');
  const userId = localStorage.getItem('user_id');
  const [bio, setBio] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const userBio = { bio };

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        userBio: userBio,
      }),
    };
    fetch(`http://localhost:5000/users/${userId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setBio(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="bio_text">
      <form onSubmit={handleSubmit}>
        <p>{bio}</p>
        <input
          type="text"
          required
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <label>User's Bio:</label>
        <button>Print Value</button>
      </form>
    </div>
  );
};

export default BioText;
