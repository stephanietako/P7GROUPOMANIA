import Form from '../components/Form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  let navigate = useNavigate();

  const login = () => {
    // if (localStorage.getItem('user', JSON.stringify({ role: 'true' }))) {
    navigate('/admin');
    // }
  };

  return (
    <>
      <div className="login">
        <Form title={'Se connecter:'} isLogin />
        <button onClick={login}> LOGIN ADMIN </button>
      </div>
    </>
  );
};

export default Login;
