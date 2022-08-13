import { useEffect, useState } from 'react';
import Posts from '../components/Posts';
import Users from '../components/Users';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Home.css';

const Home = () => {
  const [allPosts, setAllPosts] = useState();
  const [allUsers, setAllUsers] = useState();
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/posts')
      .then((response) => response.json())
      .then((posts) => {
        setAllPosts(posts);
      })
      .catch((err) => {
        console.error(err);
      });

    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .then((users) => {
        setAllUsers(users);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [update]);

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
