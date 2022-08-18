import React, { useState, useEffect } from 'react';
import '../styles/Card.css';
import Axios from '../service/caller.service';

const Card = ({ post, update, setUpdate }) => {
  const { imageUrl, postMessage, userId, usersLiked, likes, id } = post;
  const currentIdUser = localStorage.getItem('user_id');
  const [author, setAuthor] = useState();

  useEffect(() => {
    Axios(`/users/${userId}`)
      .then((user) => {
        setAuthor(user.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userId]);

  const likeBtn = () => {
    console.log('test');
    Axios.put(`/posts/${id}/likes`)
      .then(() => {
        setUpdate(!update);
      })
      .catch((error) => console.log('error', error));
  };

  return (
    <div className="card">
      {author && (
        <div className="author">
          <img
            className="card_avatar"
            src={`http://localhost:5000/client/public/uploads/profil/${author.avatar}`}
            alt={`Profil avatar of ${author.firstName} ${author.lastName}`}
            crossOrigin="anonymous"
          />
          <div>
            <p>
              {author.firstName} {author.lastName}
            </p>
            <p className="create_date">
              {new Date(author.createdAt).toDateString()}
            </p>
          </div>
        </div>
      )}
      <img
        className="cover"
        src={`http://localhost:5000/client/public/uploads/posts/${imageUrl}`}
        alt="post"
        crossOrigin="anonymous"
      />
      <div className="card_body">
        <p>{postMessage}</p>
        <div>
          <button
            onClick={likeBtn}
            className={
              usersLiked.includes(currentIdUser)
                ? 'red like_btn'
                : 'black like_btn'
            }
          >
            ♥
          </button>{' '}
          {likes}
        </div>
      </div>
    </div>
  );
};

export default Card;
