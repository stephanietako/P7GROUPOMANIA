import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

//////NEW POST Page pour créer un nouveau post
const Post = () => {
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const [postMessage, setPostMessage] = useState('');
  const userId = localStorage.getItem('user_id');
  const role = localStorage.getItem('user_role');
  const token = localStorage.getItem('access_token');
  const [image, setImage] = useState({ preview: '', data: '' });

  const onSubmitPost = () => {
    const formData = new FormData();
    formData.append('file', image.data);
    formData.append('userId', userId);
    formData.append('postMessage', postMessage);
    formData.append('role', role);

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
        alert('Error !');
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
      <form onSubmit={handleSubmit(onSubmitPost)}>
        <label htmlFor="post">Post's content:</label>
        <input
          type="textarea"
          value={postMessage}
          placeholder="Create your post here !"
          id="post"
          onChange={(e) => setPostMessage(e.target.value)}
        />
        <label htmlFor="post">Cover's post:</label>
        <input type="file" name="file" onChange={handleFileChange}></input>
        <input className="btn btn-primary" type="submit" value="Post it !" />
      </form>
    </>
  );
};

export default Post;
