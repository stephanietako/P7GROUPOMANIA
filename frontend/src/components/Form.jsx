import React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const Form = ({ title, isLogin }) => {
  //console.log('isLogin:', isLogin);
  const { handleSubmit } = useForm();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');

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

  // pour le regex password et confPassword minimum eight characters, at least one letter and one number:
  return (
    <div className="register">
      <>
        <h1>{title}</h1>
        {isLogin ? (
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
          </form>
        ) : (
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
