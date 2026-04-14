import { NavLink, useNavigate } from "react-router-dom";
import classes from "../../Styling/Layout/Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/authSlice";

const Header = () => {
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const logoutHandler = () => {
    localStorage.clear();

    dispatch(authActions.logout());

    navigate("/login");
  };

  return (
    <header className={classes.header}>
      <NavLink to="/" className={classes.logo}>
        JobPortal
      </NavLink>
      <nav>
        {!token && (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? `${classes.navLink} ${classes.active}`
                  : classes.navLink
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive
                  ? `${classes.navLink} ${classes.active}`
                  : classes.navLink
              }
            >
              Signup
            </NavLink>
          </>
        )}

        {token && (
          <button onClick={logoutHandler} className={classes.logoutBtn}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
