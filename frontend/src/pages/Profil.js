import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const Profil = () => {
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('access_token');
  const [dataUser, setDataUser] = useState();
  const [avatar, setAvatar] = useState({ preview: '', data: '' });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const requestOptions = {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    };

    const getDataUser = async () => {
      fetch(`http://localhost:5000/users/${userId}`, requestOptions)
        .then((response) => response.json())
        .then((user) => {
          setDataUser(user);
          setAvatar(user.avatar);
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setEmail(user.email);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getDataUser();
  }, [userId, token]);

  const onSubmitEditUser = () => {
    const formData = new FormData();
    if (typeof avatar === 'object') formData.append('file', avatar.data);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);

    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    fetch(`http://localhost:5000/users/${userId}`, requestOptions)
      .then((response) => {
        response.json();
      })
      .then((data) => {
        toast.success('You have been successfully edit your account', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/');
      })
      .catch((error) => {
        toast.error('An error has occurred to upload your image', {
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
    setAvatar(img);
  };

  const deleteAccount = () => {
    const confirmation = window.confirm(
      'Do you really want to delete your account? (No recovery possible)'
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

    fetch(`http://localhost:5000/users/${userId}`, requestOptions)
      .then((response) => response.json())
      .then(() => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        //localStorage.removeItem('role');
        localStorage.clear();
        toast.success('Your account has been successfully deleted.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/login');
      });
  };

  return (
    <div className="user_profil">
      PAGE PROFIL
      {dataUser && (
        <>
          <h1>My profil</h1>
          <img
            className="avatar_profil"
            src={`http://localhost:5000/users/image/${dataUser.avatar}`}
            //src={`http://localhost:5000/client/public/uploads/profil/${dataUser.avatar}`}
            alt={`Profil avatar of ${dataUser.firstName} ${dataUser.lastName}`}
            crossOrigin="anonymous"
          />
          <h4>
            {dataUser.firstName} {dataUser.lastName}
          </h4>
          <p>{dataUser.bio}</p>
        </>
      )}
      <hr className="separation_profile_edit" />
      <form onSubmit={handleSubmit(onSubmitEditUser)}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          accept=".gif, .jpeg, .jpg"
        ></input>
        <input type="submit" value="Edit your account !" />
      </form>
      <button className="delete_profil_btn" onClick={deleteAccount}>
        Delete account
      </button>
    </div>
  );
};

export default Profil;
