import Form from '../components/Form';
//import { Link } from 'react-router-dom';
// import { useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Auth from '../contexts/Auth';

const Login = () => {
  // const navigate = useNavigate();
  // const { isAuthenticated } = useContext(Auth);
  // //let { id } = useParams();
  // //const token = localStorage.getItem('access_token');
  // //const [role, setRole] = useState(' ');
  // const handleLinkClick = (event) => {
  //   console.log('LINK CLICKED');
  // };
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('./admin');
  //   }
  // }, [navigate, isAuthenticated]);

  return (
    <>
      <div className="login">
        <Form title={'Se connecter:'} isLogin />
        {/* <Link
          onClick={handleLinkClick}
          to="/admin"
          className="button_admin_login"
        >
          {' '}
          ADMIN
        </Link> */}
      </div>
    </>
  );
};

export default Login;
