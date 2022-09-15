import { useEffect, useState } from 'react';
import Posts from '../components/Posts';
import Users from '../components/Users';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Home.css';

const Home = () => {
  const [allPosts, setAllPosts] = useState();
  const [allUsers, setAllUsers] = useState();
  const [update, setUpdate] = useState(false);
  const token = localStorage.getItem('access_token');

  let requestOptions = {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  };

  useEffect(() => {
    fetch('http://localhost:5000/posts', requestOptions)
      .then((response) => response.json())
      .then((posts) => {
        setAllPosts(posts);
      })
      .catch((err) => {
        console.error(err);
      });

    fetch('http://localhost:5000/users', requestOptions)
      .then((response) => response.json())
      .then((users) => {
        setAllUsers(users.reverse());
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return (
    <div className="home">
      {allPosts && (
        <Posts allPosts={allPosts} update={update} setUpdate={setUpdate} />
      )}
      {allUsers && <Users allUsers={allUsers} />}
    </div>
  );
};

export default Home;
