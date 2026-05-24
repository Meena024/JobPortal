import { useSelector, useDispatch } from "react-redux";

import { dbApi } from "../../../services/dbApi";
import { adminActions } from "../../../store/adminSlice";

import classes from "../../../Styling/Pages/AdminDashboard/UsersList.module.css";

const UsersList = () => {
  const dispatch = useDispatch();

  const { allUsers } = useSelector((state) => state.admin);

  /*
    DELETE USER
  */

  const deleteHandler = async (userId) => {
    try {
      await dbApi.remove(`users/${userId}`);

      dispatch(adminActions.removeUser(userId));
    } catch (err) {
      console.error(err);
    }
  };

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
                onClick={() => deleteHandler(user.id)}
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
