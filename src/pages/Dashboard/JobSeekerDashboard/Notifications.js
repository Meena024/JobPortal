import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { dbApi } from "../../../services/dbApi";
import { jobSeekerActions } from "../../../store/jobSeekerSlice";

import classes from "../../../Styling/Pages/JobSeekerDashboard/Notifications.module.css";

const Notifications = () => {
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");

  const notifications = useSelector((state) => state.jobs.notifications || []);

  /*
    FETCH NOTIFICATIONS
  */

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await dbApi.get(`notifications/${userId}`);

        if (!data) {
          dispatch(jobSeekerActions.setNotifications([]));
          return;
        }

        /*
          IMPORTANT FIX:
          firebaseKey must override inner id
        */

        const list = Object.entries(data)
          .map(([firebaseKey, value]) => ({
            ...value,
            id: firebaseKey,
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        dispatch(jobSeekerActions.setNotifications(list));
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };

    fetchNotifications();
  }, [dispatch, userId]);

  /*
    MARK READ + NAVIGATE
  */

  const markReadHandler = async (note) => {
    try {
      await dbApi.patch(`notifications/${userId}/${note.id}`, { read: true });

      dispatch(jobSeekerActions.markNotificationRead(note.id));

      /*
        SWITCH PAGE
      */

      dispatch(jobSeekerActions.setActiveView("applied"));

      /*
        HIGHLIGHT TARGET APPLICATION
      */

      if (note.applicationId) {
        dispatch(
          jobSeekerActions.setHighlightedApplication(note.applicationId),
        );
      }
    } catch (err) {
      console.error("Notification click error:", err);
    }
  };

  return (
    <div className={classes.wrapper}>
      <h1 className={classes.title}>Notifications</h1>

      {notifications.length === 0 && (
        <p className={classes.empty}>No notifications yet</p>
      )}

      <div className={classes.list}>
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`${classes.card} ${
              note.read ? classes.read : classes.unread
            }`}
            onClick={() => markReadHandler(note)}
          >
            <div className={classes.message}>{note.message}</div>

            <div className={classes.date}>
              {new Date(note.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
