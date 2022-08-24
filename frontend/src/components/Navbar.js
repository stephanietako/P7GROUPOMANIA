import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const Navbar = () => {
  useEffect(() => {
    refreshToken();
  });

  const [userId, setUserId] = useState();
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [imageUrl, setImgUrl] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const navigate = useNavigate();

  const refreshToken = async () => {
    const response = {
      method: 'GET',
      headers: { 'Content-Type': 'apllication/json' },
      body: JSON.stringify({
        token: token,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        imgUrl: imageUrl,
        email: email,
        role: role,
        expire: expire,
      }),
    };

    try {
      await fetch('http://localhost:5000/users/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUserId(decoded.userId);
      setFirstName(decoded.nom);
      setLastName(decoded.prenom);
      setImgUrl(decoded.userImg);
      setEmail(decoded.email);
      setRole(decoded.isAdmin);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate('/', { replace: true });
      }
    }
  };

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

  function parseJwt(token) {
    if (!token) {
      return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  const user = parseJwt(token);
  console.log(user);

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
