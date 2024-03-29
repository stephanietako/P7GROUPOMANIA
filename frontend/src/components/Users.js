import '../styles/Users.css';

const Users = ({ allUsers }) => {
  return (
    <div className="users_section">
      <h2 className="users_title">Users</h2>
      <div className="users">
        <ul>
          {allUsers.map((user, index) => {
            let names = `${user.firstName} ${user.lastName} 
            / ${user.bio}`;

            if (names.length > 75) {
              names = names.substring(0, 20) + '...';
            }
            return (
              <li className="user" key={`USER-${user.id}-${index}`}>
                <img
                  className="avatar"
                  src={`http://localhost:5000/client/public/uploads/profil/${user.avatar}`}
                  alt={`Profil avatar of ${user.firstName} ${user.lastName}`}
                  crossOrigin="anonymous"
                />
                {names}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default Users;
