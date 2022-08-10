import React from 'react';
import { useForm } from 'react-hook-form';

export const Form = ({ title, isLogin }) => {
  console.log('isLogin:', isLogin);
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    if (data.password !== data.confPassword)
      alert("le mot de passe n'est pas le même");
  };

  // pour le regex password et confPassword minimum eight characters, at least one letter and one number:
  return (
    <>
      <h1>{title}</h1>
      {isLogin ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>"Se connec"</h1>
          <input
            {...register('email', {
              pattern:
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            })}
            placeholder="email"
          />
          <input
            {...register('password', {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            })}
            placeholder="password"
          />
          <input type="submit" value="Connection me" />
        </form>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register('firstName', { required: true, maxLength: 20 })}
            placeholder="firstName"
          />
          <input
            {...register('lastName', { pattern: /^[A-Za-z]+$/i })}
            placeholder="lasttName"
          />
          <input
            {...register('email', {
              pattern:
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            })}
            placeholder="email"
          />
          <input
            {...register('password', {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            })}
            placeholder="password"
          />
          <input
            {...register('confPassword', {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            })}
            placeholder="confirm password"
          />
          <input type="submit" value="Register me" />
        </form>
      )}
    </>
  );
};

export default Form;
