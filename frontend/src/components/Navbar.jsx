import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import groupomania from '../assets/images/groupomania.svg';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [userId, setUserId] = useState();
  const navigate = useNavigate();

  const logoutBtn = () => {
    //options + body
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    //fetch final
    fetch('http://localhost:5000/users/logout', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserId();

        localStorage.removeItem('user_id');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        localStorage.clear();

        toast.success('You have been successfully logout', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
        alert('An error has occurred');
      });
  };

  return (
    <nav>
      <img src={groupomania} alt="Groupomania" className="logo" />

      <div className="navlinks">
        <Link to="/">Home</Link>
        <Link to="/profil">Mon Profil</Link>
      </div>

      <div className="navbtns">
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>

        <button id="logout-button" onClick={() => logoutBtn()}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
