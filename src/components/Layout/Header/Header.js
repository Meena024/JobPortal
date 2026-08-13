import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../../../store/authSlice";
import { adminActions } from "../../../store/adminSlice";
import { jobSeekerActions } from "../../../store/jobSeekerSlice";
import { recruiterActions } from "../../../store/recruiterSlice";

import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const logoutHandler = () => {
    localStorage.clear();

    dispatch(authActions.logout());
    dispatch(adminActions.setReset());
    dispatch(jobSeekerActions.setReset());
    dispatch(recruiterActions.setReset());

    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>JobPortal</div>

      {token && (
        <button
          type="button"
          className={styles.logoutButton}
          onClick={logoutHandler}
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
