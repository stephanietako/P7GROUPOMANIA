import '../styles/Users.css';

const Users = ({ allUsers }) => {
  console.log(allUsers);

  return (
    <div className="users">
      <ul>
        {allUsers.map((user, index) => {
          let names = `${user.firstName} ${user.lastName}`;

          if (names.length > 14) {
            names = names.substring(0, 13) + '...';
          }
          return (
            <li className="user" key={`USER-${user.id}-${index}`}>
              <img
                className="avatar"
                src={`http://localhost:5000/users/image/${user.avatar}`}
                alt={`Profil avatar of ${user.firstName} ${user.lastName}`}
                crossOrigin="anonymous"
              />
              {names}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Users;
