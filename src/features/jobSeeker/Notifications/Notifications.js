import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { markNotificationRead } from "../../../store/jobSeekerActions";
import { jobSeekerActions } from "../../../store/jobSeekerSlice";

import classes from "./Notifications.module.css";

const DISPLAY_BATCH_SIZE = 25;

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth.userId);
  const notifications = useSelector((state) => state.jobs?.notifications || []);

  /* =====================================================
     INFINITE SCROLL STATE
  ===================================================== */

  const [visibleCount, setVisibleCount] = useState(DISPLAY_BATCH_SIZE);

  /*
    Sentinel placed below the notification list.

    When it enters the viewport,
    the next batch of notifications
    will be displayed.
  */

  const observerRef = useRef(null);

  /* =====================================================
     SORT NOTIFICATIONS
  ===================================================== */

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [notifications]);

  /* =====================================================
     RESET PAGINATION WHEN NOTIFICATIONS CHANGE
  ===================================================== */

  useEffect(() => {
    setVisibleCount(DISPLAY_BATCH_SIZE);
  }, [notifications.length]);

  /* =====================================================
     VISIBLE NOTIFICATIONS
  ===================================================== */

  const visibleNotifications = useMemo(() => {
    return sortedNotifications.slice(0, visibleCount);
  }, [sortedNotifications, visibleCount]);

  /* =====================================================
     CHECK WHETHER MORE NOTIFICATIONS EXIST
  ===================================================== */

  const hasMoreNotifications = visibleCount < sortedNotifications.length;

  /* =====================================================
     INFINITE SCROLL
  ===================================================== */

  useEffect(() => {
    /*
      No more notifications to display.
    */

    if (!hasMoreNotifications) {
      return;
    }

    const currentElement = observerRef.current;

    /*
      Sentinel does not exist yet.
    */

    if (!currentElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting) {
          return;
        }

        /*
          Display the next batch.

          Math.min() prevents visibleCount
          from exceeding the total number
          of notifications.
        */

        setVisibleCount((previousCount) =>
          Math.min(
            previousCount + DISPLAY_BATCH_SIZE,
            sortedNotifications.length,
          ),
        );
      },
      {
        root: null,

        /*
          Start displaying the next batch
          before the user reaches the bottom.
        */

        rootMargin: "300px",

        threshold: 0,
      },
    );

    observer.observe(currentElement);

    /*
      Cleanup observer.
    */

    return () => {
      observer.disconnect();
    };
  }, [hasMoreNotifications, sortedNotifications.length]);

  /* =====================================================
     MARK NOTIFICATION AS READ
  ===================================================== */

  const markReadHandler = async (note) => {
    try {
      await dispatch(markNotificationRead(userId, note.id));

      if (note.applicationId) {
        dispatch(
          jobSeekerActions.setHighlightedApplication(note.applicationId),
        );
      }

      navigate("/jobseeker/applied");
    } catch (err) {
      console.error("Notification click error:", err);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className={classes.wrapper}>
      {/* =================================================
          HEADER
      ================================================= */}

      <h1 className={classes.title}>Notifications</h1>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {sortedNotifications.length === 0 && (
        <p className={classes.empty}>No notifications yet</p>
      )}

      {/* =================================================
          NOTIFICATION LIST
      ================================================= */}

      {sortedNotifications.length > 0 && (
        <div className={classes.list}>
          {visibleNotifications.map((note) => (
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
      )}

      {/* =================================================
          INFINITE SCROLL SENTINEL
      ================================================= */}

      {hasMoreNotifications && (
        <div
          ref={observerRef}
          className={classes.loadMoreTrigger}
          aria-hidden="true"
        >
          Loading more notifications...
        </div>
      )}
    </div>
  );
};

export default Notifications;
