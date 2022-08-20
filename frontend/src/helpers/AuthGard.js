import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  let token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthGuard;
