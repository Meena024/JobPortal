import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdNotificationsNone } from "react-icons/md";

import { authActions } from "../../../store/authSlice";
import { adminActions } from "../../../store/adminSlice";
import { jobSeekerActions } from "../../../store/jobSeekerSlice";
import { recruiterActions } from "../../../store/recruiterSlice";

import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const role = useSelector((state) => state.auth.role);

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const notifications = useSelector((state) => state.jobs?.notifications || []);

  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const notificationsHandler = () => {
    navigate("/jobseeker/notifications");
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logoutHandler = () => {
    localStorage.clear();

    dispatch(authActions.logout());
    dispatch(adminActions.setReset());
    dispatch(jobSeekerActions.setReset());
    dispatch(recruiterActions.setReset());

    navigate("/login");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <header className={styles.header}>
      <div className={styles.logo}>JobPortal</div>

      {token && (
        <div className={styles.actions}>
          {/* =================================================
              JOB SEEKER NOTIFICATIONS
          ================================================= */}

          {role === "job_seeker" && (
            <button
              type="button"
              className={styles.notificationButton}
              onClick={notificationsHandler}
              aria-label={`Notifications${
                unreadNotificationCount > 0
                  ? `, ${unreadNotificationCount} unread`
                  : ""
              }`}
            >
              <MdNotificationsNone className={styles.notificationIcon} />

              {unreadNotificationCount > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadNotificationCount > 99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              )}
            </button>
          )}

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            className={styles.logoutButton}
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
