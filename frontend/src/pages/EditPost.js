import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const EditPost = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const [postMessage, setPostMessage] = useState('');
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('access_token');
  const [image, setImage] = useState({ preview: '', data: '' });
  const [currentPost, setCurrentPost] = useState();

  let requestOptions = {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  };

  useEffect(() => {
    fetch(`http://localhost:5000/posts/${id}`, requestOptions)
      .then((response) => response.json())
      .then((post) => {
        setCurrentPost(post);
        setPostMessage(post.postMessage);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const onSubmitPost = () => {
    const formData = new FormData();
    formData.append('file', image.data);
    formData.append('userId', userId);
    formData.append('postMessage', postMessage);

    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    fetch('http://localhost:5000/posts/', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        // toast error
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
      {currentPost && (
        <>
          <h1>Edit my post</h1>
          <form onSubmit={handleSubmit(onSubmitPost)}>
            <label htmlFor="post">Post's content:</label>
            <input
              type="textarea"
              value={postMessage}
              id="post"
              onChange={(e) => setPostMessage(e.target.value)}
            />
            <label htmlFor="post">Cover's post:</label>
            <img
              className="avatar_profil"
              src={`http://localhost:5000/client/public/uploads/posts/${currentPost.imageUrl}`}
              alt={`Post cover of ID ${currentPost.id}`}
              crossOrigin="anonymous"
            />
            <input type="file" name="file" onChange={handleFileChange}></input>
            <input
              className="btn btn-primary"
              type="submit"
              value="Edit it !"
            />
          </form>
        </>
      )}
    </>
  );
};

export default EditPost;
