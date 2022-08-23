import { useState, useEffect } from 'react';
import FileUploaded from '@/components/FileUploaded';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
/////////////
const Profil = () => {
  const [dataUser, setDataUser] = useState();
  const token = localStorage.getItem('access_token');
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  let requestOptions = {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  };
  /////////////////////// SETDATAUSER
  useEffect(() => {
    const getDataUser = async () => {
      fetch(`http://localhost:5000/users/${userId}`, requestOptions)
        .then((response) => response.json())
        .then((user) => {
          setDataUser(user);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getDataUser();
  }, [userId]);
  ///////////////////DELETE ACCOUNT ////////////////////
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
      {dataUser && (
        <>
          <h1>My profil</h1>
          <img
            className="avatar_profil"
            src={`http://localhost:5000/client/public/uploads/profil/${dataUser.avatar}`}
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
      <FileUploaded />
      <button className="delete_profil_btn" onClick={deleteAccount}>
        Delete my account
      </button>
    </div>
  );
};

export default Profil;
