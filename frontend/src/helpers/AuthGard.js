import { Navigate } from 'react-router-dom';

const AuthGard = ({ children }) => {
  let logged = false; //init

  //decode JWT
  const decodeToken = (token) => {
    if (!token) {
      return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  //verify exp date
  const verify = (exp) => {
    if (Date.now() <= exp * 1000) {
      console.log('✔️ Token');
      return true;
    } else {
      console.log('❌ Token');
      return false;
    }
  };

  if (localStorage.getItem('refresh_token')) {
    //check if refresh token exist
    logged = true;
    const token = localStorage.getItem('refresh_token'); //get token from localstorage
    const dataUser = decodeToken(token);
    if (verify(dataUser.exp)) logged = true; //if exp date OK, then logged = true
  }
  if (!logged) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default AuthGard;
