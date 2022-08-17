import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import groupomania from '../assets/images/groupomania.svg';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confPassword, setConfPassword] = useState('');
  const [userId, setUserId] = useState();
  const navigate = useNavigate();
  //const location = useLocation();

  //logout
  //useEffect(() => {}, [location.key]);

  //logout
  useEffect(() => {
    const userlog = localStorage.clear('');
    if (userlog) {
      const founduser = userlog;
      setUserId(founduser);
      localStorage.clear();
    }
  }, [userId]);

  const logoutBtn = () => {
    //options + body
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        //Authorization: 'Bearer ' + localStorage.getItem('refresh_token'),
      }),
    };
    //fetch final
    fetch('http://localhost:5000/users/logout', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserId(); // This ensures that the user state is null
        //setEmail('');
        //setPassword('');
        //setRefresh_token('');
        //setAccess_token('');

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

  /////////////////////////
  return (
    <nav>
      <img src={groupomania} alt="Groupomania" className="logo" />

      <div className="navlinks">
        <Link to="/">Home</Link>
      </div>

      <div className="navbtns">
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>

        <button id="logout-button" onClick={() => logoutBtn()}>
          Logout
        </button>

        {/*logout*/}
      </div>
    </nav>
  );
};

export default Navbar;
