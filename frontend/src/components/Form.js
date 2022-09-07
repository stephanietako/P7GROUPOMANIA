import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/Form.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const Form = ({ title, isLogin, user }) => {
  const { handleSubmit } = useForm();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  //const [role, setRole] = useState({ role: 'false' });
  const navigate = useNavigate();

  const onSubmitRegister = () => {
    if (password !== confPassword) alert("le mot de passe n'est pas le même");
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

    fetch('http://localhost:5000/users/register', requestOptions)
      .then((response) => response.json())
      .then(() => {
        if (
          firstName &&
          lastName &&
          email &&
          password &&
          confPassword !== null
        ) {
          toast.success('Your account has been successfully created', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          console.log(' PROBLEMES !!!!');
        }

        navigate('/register');
      })
      .catch((error) => console.error(error));
    toast.error('An error occurred while creating your account', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const onSubmitLogin = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    fetch('http://localhost:5000/users/login', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('user_id', data.id);
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('user_role', data.role);

        if (data.id && data.accessToken && data.refreshToken) {
          toast.success('You have been successfully connected', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate('/', { replace: true });
        } else {
          toast.error('Invalid email adress or password do it again', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate('/login', { replace: true });
        }
      });
  };

  return (
    <div className="register">
      <>
        <h1>{title}</h1>
        {isLogin ? (
          //form login
          <form onSubmit={handleSubmit(onSubmitLogin)}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              value={email}
              placeholder="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              value={password}
              placeholder="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input className="btn btn-primary" type="submit" value="Login" />
          </form>
        ) : (
          // Register
          <form onSubmit={handleSubmit(onSubmitRegister)}>
            <label htmlFor="firstName">FirstName</label>
            <input
              type="text"
              value={firstName}
              placeholder="firstName"
              id="firstName"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="lastName">LastName</label>
            <input
              type="text"
              value={lastName}
              placeholder="lastName"
              id="lastName"
              onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              type="text"
              value={email}
              placeholder="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              placeholder="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="confPassword">Confirm Password</label>
            <input
              type="password"
              value={confPassword}
              placeholder="confPassword"
              id="confPassword"
              onChange={(e) => setConfPassword(e.target.value)}
            />
            <input className="btn btn-primary" type="submit" value="Register" />
          </form>
        )}
      </>
    </div>
  );
};
export default Form;
