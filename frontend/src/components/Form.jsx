import React from 'react';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const Form = ({ title, isLogin }) => {
  //console.log('isLogin:', isLogin);
  const { handleSubmit } = useForm();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [userId, setUserId] = useState();
  //const [refresh_token, setRefresh_token] = useState();
  //const [acces_token_token, setAccess_token] = useState();

  // REGISTER
  const onSubmitRegister = () => {
    //check password
    if (password !== confPassword) alert("le mot de passe n'est pas le même");
    //options + body
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      }),
    };
    //fetch final
    fetch('http://localhost:5000/users/register', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); //success
        alert('Your account has been successfully created');
      })
      .catch((err) => {
        console.error(err); //error
        alert('An error occurred while creating your account');
      });
  };

  //LOGIN
  const onSubmitLogin = () => {
    //options + body
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };
    //fetch final
    fetch('http://localhost:5000/users/login', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem('user_id', data.id);
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        toast.success('You have been successfully connected', {
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
        alert('An error has occurred');
      });
  };

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
        setEmail('');
        setPassword('');
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
      })
      .catch((error) => {
        console.log(error);
        alert('An error has occurred');
      });
  };

  return (
    <div className="register">
      <>
        <h1>{title}</h1>
        {isLogin ? (
          //form login
          <form onSubmit={handleSubmit(onSubmitLogin)}>
            <input
              type="email"
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="btn btn-primary"
              type="submit"
              value="Connection me"
            />
            {/*logout*/}
            <button id="logout-button" onClick={() => logoutBtn()}>
              Logout
            </button>
          </form>
        ) : (
          //form register
          <form onSubmit={handleSubmit(onSubmitRegister)}>
            <input
              type="firstName"
              value={firstName}
              placeholder="firstName"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="lastName"
              value={lastName}
              placeholder="lastName"
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              value={confPassword}
              placeholder="confPassword"
              onChange={(e) => setConfPassword(e.target.value)}
            />
            <input
              className="btn btn-primary"
              type="submit"
              value="Register me"
            />
          </form>
        )}
      </>
    </div>
  );
};
export default Form;
