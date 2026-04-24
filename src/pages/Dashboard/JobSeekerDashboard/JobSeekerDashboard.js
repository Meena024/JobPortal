import classes from "../../../Styling/Pages/JobSeekerDashboard/JobSeekerDashboard.module.css";

import { useDispatch, useSelector } from "react-redux";

import { jobSeekerActions } from "../../../store/jobSeekerSlice";

import AvailableJobs from "./AvailableJobs";
import AppliedJobs from "./AppliedJobs";
import MyResumes from "./MyResumes";

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();

  const activeView = useSelector((state) => state.jobs.activeView);

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
          onClick={() => dispatch(jobSeekerActions.setActiveView("resumes"))}
        >
          My Resumes
        </button>
      </aside>

      <main className={classes.content}>
        {activeView === "available" && <AvailableJobs />}

        {activeView === "applied" && <AppliedJobs />}

        {activeView === "resumes" && <MyResumes />}
      </main>
    </div>
  );
};

export default JobSeekerDashboard;
