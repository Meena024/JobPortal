import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/AdminDashboard/UsersList.module.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await dbApi.get("users");

      if (!data) return;

      const usersArray = Object.entries(data)

        .map(([id, value]) => ({
          id,

          ...value.profile,
        }));

      setUsers(usersArray);
    };

    fetchUsers();
  }, []);

  const deleteHandler = async (userId) => {
    await dbApi.remove(`users/${userId}`);

    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <>
      <h1 className={classes.title}>Manage Users</h1>

      {users.length === 0 && <p className={classes.empty}>No users found</p>}

      <div className={classes.userGrid}>
        {users.map((user) => (
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
