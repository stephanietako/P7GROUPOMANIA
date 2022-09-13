import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const EditPost = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const [postMessage, setPostMessage] = useState('');
  const token = localStorage.getItem('access_token');
  const [imagePost, setImagePost] = useState({ preview: '', data: '' });
  const [currentPost, setCurrentPost] = useState();

  useEffect(() => {
    const requestOptions = {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    };

    const getDataPost = async () => {
      fetch(`http://localhost:5000/posts/${id}`, requestOptions)
        .then((response) => response.json())
        .then((post) => {
          setCurrentPost(post);
          setPostMessage(post.postMessage);
          setImagePost(post.imagePost);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getDataPost();
  }, [id, token]);

  const onSubmitPost = () => {
    const formData = new FormData();
    if (typeof imagePost === 'object') formData.append('file', imagePost.data);
    formData.append('postMessage', postMessage);

    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    fetch(`http://localhost:5000/posts/${id}`, requestOptions)
      .then((response) => {
        const { ok, statusText } = response;
        if (ok) {
          toast.success('You have been successfully edit your post !', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate('/');
        } else {
          toast.error(statusText, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        toast.error('An error has occurred !', {
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
    setImagePost(img);
  };
  return (
    <>
      {currentPost && (
        <>
          <h1>Edit my post</h1>
          <form onSubmit={handleSubmit(onSubmitPost)}>
            {/* le message */}
            <label htmlFor="post">Post's content:</label>
            <input
              type="textarea"
              value={postMessage}
              id="post"
              onChange={(e) => setPostMessage(e.target.value)}
            />
            {/* l image */}
            <label htmlFor="post">Cover's post:</label>

            <img
              className="avatar_profil"
              src={`http://localhost:5000/posts/image/${currentPost.imagePost}`}
              // src={`http://localhost:5000/client/public/uploads/posts/${currentPost.imagePost}`}
              alt={`Post cover of ID ${currentPost.id}`}
              crossOrigin="anonymous"
            />
            {/* submit les changements dans le post */}
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".gif, .jpeg, .jpg"
            ></input>
            <input
              className="button_change_message"
              type="submit"
              value="Edit your message !"
            />
          </form>
        </>
      )}
    </>
  );
};

export default EditPost;
