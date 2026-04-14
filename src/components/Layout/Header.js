import { NavLink, useNavigate } from "react-router-dom";
import classes from "../../Styling/Header.module.css";

const Header = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/");
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
