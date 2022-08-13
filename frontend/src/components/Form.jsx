import React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useEffect } from 'react';

export const Form = ({ title, isLogin }) => {
  console.log('isLogin:', isLogin);
  const { handleSubmit } = useForm();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');

  const onSubmit = (data) => {
    console.log(data);
    if (data.password !== data.confPassword)
      alert("le mot de passe n'est pas le même");
  };

  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(),
    };
    fetch('http://localhost:5000/users', requestOptions)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confPassword: data.confPassword,
        })
      );
  }, []);

  // pour le regex password et confPassword minimum eight characters, at least one letter and one number:
  return (
    <div className="register">
      <>
        <h1>{title}</h1>
        {isLogin ? (
          <form onSubmit={handleSubmit(onSubmit)}>
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
          <form onSubmit={handleSubmit(onSubmit)}>
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
              type="confPassword"
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
