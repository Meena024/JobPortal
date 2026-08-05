import { useSelector } from "react-redux";
import { removeUser } from "../../../store/adminActions";

import classes from "../../../Styling/Pages/AdminDashboard/UsersList.module.css";

const UsersList = () => {
  const { allUsers } = useSelector((state) => state.admin);

  return (
    <>
      <h1 className={classes.title}>Manage Users</h1>

      {allUsers.length === 0 && <p className={classes.empty}>No users found</p>}

      <div className={classes.userGrid}>
        {allUsers.map((user) => (
          <div key={user.id} className={classes.userCard}>
            <div className={classes.email}>{user.email}</div>

            <span className={`${classes.role} ${classes[user.role]}`}>
              {user.role}
            </span>

            <div className={classes.cardBtns}>
              <button
                className={classes.deleteBtn}
                onClick={() => removeUser(user.id)}
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UsersList;
