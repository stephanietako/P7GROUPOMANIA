import { useEffect, useState } from 'react';
import Posts from '../components/Posts';
import Users from '../components/Users';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Home.css';
import Axios from '../service/caller.service';
//import Navbar from '@/components/Navbar';
const Home = () => {
  const [allPosts, setAllPosts] = useState();
  const [allUsers, setAllUsers] = useState();
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    Axios('/posts')
      .then((posts) => {
        setAllPosts(posts.data);
        console.log(posts);
      })
      .catch((err) => {
        console.error(err);
      });

    Axios('/users')
      .then((users) => {
        setAllUsers(users.data);
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
