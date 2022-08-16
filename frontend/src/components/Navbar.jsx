import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import groupomania from '../assets/images/groupomania.svg';

const Navbar = () => {
  return (
    <nav>
      <img src={groupomania} alt="Groupomania" className="logo" />
      <div className="navlinks">
        <Link to="/">Home</Link>
        <Link to="/">Home</Link>
      </div>
      <div className="navbtns">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
