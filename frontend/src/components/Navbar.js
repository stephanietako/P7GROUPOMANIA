import '@/styles/Navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [userId, setUserId] = useState();
  const navigate = useNavigate();

  const logoutBtn = () => {
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    fetch('http://localhost:5000/users/logout', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setUserId();
        // Setup LocalStorage
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
        toast.error('An error has occurred', {
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
    <nav>
      <div className="navlinks">
        <Link to="/">Home</Link>
        <Link to="/profil">My Profil</Link>
        <Link to="/post">New Post</Link>
      </div>
      <div className="navbtns">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <button id="logout-button" onClick={() => logoutBtn()}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
