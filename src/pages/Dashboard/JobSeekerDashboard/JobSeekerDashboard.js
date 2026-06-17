import { useDispatch, useSelector } from "react-redux";
import { jobSeekerActions } from "../../../store/jobSeekerSlice";

import classes from "../../../Styling/Pages/JobSeekerDashboard/JobSeekerDashboard.module.css";

import AvailableJobs from "./AvailableJobs";
import AppliedJobs from "./AppliedJobs";
import MyResumes from "./MyResumes";
import SavedJobs from "./SavedJobs";
import Notifications from "./Notifications";
import MyInterviews from "./MyInterviews";

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();

  const activeView = useSelector((state) => state.jobs.activeView);

  const notifications = useSelector((state) => state.jobs.notifications || []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={classes.dashboard}>
      <aside className={classes.sidebar}>
        <h2>Job Seeker Panel</h2>

        <button
          onClick={() => dispatch(jobSeekerActions.setActiveView("available"))}
        >
          Available Jobs
        </button>

        <button
          onClick={() => dispatch(jobSeekerActions.setActiveView("applied"))}
        >
          Applied Jobs
        </button>

        <button
          onClick={() => dispatch(jobSeekerActions.setActiveView("saved"))}
        >
          Saved Jobs
        </button>

        <button
          onClick={() => dispatch(jobSeekerActions.setActiveView("interviews"))}
        >
          My Interviews
        </button>

        <button
          onClick={() => dispatch(jobSeekerActions.setActiveView("resumes"))}
        >
          My Resumes
        </button>

        {/* NEW NOTIFICATIONS BUTTON */}

        <button
          className={classes.notificationBtn}
          onClick={() =>
            dispatch(jobSeekerActions.setActiveView("notifications"))
          }
        >
          Notifications
          {unreadCount > 0 && (
            <span className={classes.badge}>{unreadCount}</span>
          )}
        </button>
      </aside>

      <main className={classes.content}>
        {activeView === "available" && <AvailableJobs />}

        {activeView === "applied" && <AppliedJobs />}

        {activeView === "saved" && <SavedJobs />}

        {activeView === "resumes" && <MyResumes />}

        {activeView === "notifications" && <Notifications />}

        {activeView === "interviews" && <MyInterviews />}
      </main>
    </div>
  );
};

export default JobSeekerDashboard;
