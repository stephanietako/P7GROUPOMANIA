import React, { useState, useEffect } from 'react';
import '../styles/Card.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Card = ({ post, update, setUpdate }) => {
  const navigate = useNavigate();
  const { imageUrl, postMessage, userId, usersLiked, likes, id } = post;
  const currentIdUser = localStorage.getItem('user_id');
  const token = localStorage.getItem('access_token');
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
        Authorization: `Bearer ${token}`,
      }),
    };
    fetch(`http://localhost:5000/posts/${id}/likes`, requestOptions)
      .then((response) => response.json())
      .then(() => {
        setUpdate(!update);
      })
      .catch((error) => {
        toast.error('Your like could not be applied', {
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

  const editPost = (id) => {
    navigate(`/edit-post/${id}`);
  };

  const deletePost = (id) => {
    const confirmation = window.confirm(
      'Are you sure you want to delete your post ?'
    );
    if (confirmation === false) {
      return;
    }
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    };
    fetch(`http://localhost:5000/posts/${id}`, requestOptions)
      .then((response) => response.json())
      .then(() => {
        setUpdate(!update);
        toast.success('Your post has been successfully deleted !', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        toast.error('Your message could not be deleted.', {
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
            disabled={Number(currentIdUser) === userId ? 'false' : ''}
            className={
              usersLiked.includes(currentIdUser)
                ? 'red like_btn'
                : 'black like_btn'
            }
          >
            ♥
          </button>{' '}
          {likes}
          {Number(currentIdUser) === userId ? (
            <div className="options_buttons">
              <button onClick={() => editPost(id)}>Edit</button>{' '}
              <button onClick={() => deletePost(id)}>Delete</button>{' '}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
