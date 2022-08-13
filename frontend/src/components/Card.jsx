import React, { useState, useEffect } from 'react';
import '../styles/Card.css';

const Card = ({ post, update, setUpdate }) => {
  const { imageUrl, postMessage, userId, usersLiked, likes, id } = post;
  const currentIdUser = localStorage.getItem('user_id');
  const [author, setAuthor] = useState();

  useEffect(() => {
    fetch(`http://localhost:5000/users/${userId}`)
      .then((response) => response.json())
      .then((user) => {
        setAuthor(user);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userId]);

  const likeBtn = () => {
    let requestOptions = {
      method: 'PUT',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('refresh_token'),
      }),
    };

    fetch(`http://localhost:5000/posts/${id}/likes`, requestOptions)
      .then((response) => response.json())
      .then(() => {
        setUpdate(!update);
      })
      .catch((error) => console.log('error', error));
  };

  return (
    <div
      className={
        Number(currentIdUser) === userId ? 'card article_author' : 'card'
      }
    >
      <img
        className="cover"
        src={`http://localhost:5000/posts/image/${imageUrl}`}
        alt="post"
        crossOrigin="anonymous"
      />
      <div className="card_body">
        <p>{postMessage}</p>
        {author && <p>{`― ${author.firstName} ${author.lastName}`}</p>}
        <div>
          <button
            disabled={Number(currentIdUser) === userId ? 'false' : ''}
            onClick={() => likeBtn()}
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
