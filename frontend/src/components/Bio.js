import React from 'react';
import { useState } from 'react';

const BioText = (e) => {
  const id = localStorage.getItem('user_id');
  const [bio, setBio] = useState('');
  const token = localStorage.getItem('access_token');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userBio = { bio };

    fetch(`http://localhost:5000/users/${id}`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(userBio),
    }).then(() => {
      console.log('new bio added');
    });
  };

  return (
    <div className="bio_text">
      <p>{bio}</p>
      <form onSubmit={handleSubmit}>
        <label>User's Bio:</label>
        <input
          type="text"
          required
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <button>Print Value</button>
      </form>
    </div>
  );
};

export default BioText;
