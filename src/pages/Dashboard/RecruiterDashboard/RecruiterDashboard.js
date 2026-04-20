import { useEffect } from "react";

import classes from "../../../Styling/Pages/RecruiterDashboard/RecruitersDashboard.module.css";

import { dbApi } from "../../../services/dbApi";

import { useDispatch, useSelector } from "react-redux";

import { recruiterActions } from "../../../store/recruiterSlice";

import CreateJob from "./CreateJob";
import MyJobs from "./MyJobs";
import RecruiterApplications from "./RecruiterApplications";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();

  const activeView = useSelector((state) => state.recruiter.activeView);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(recruiterActions.setLoading(true));

      try {
        const data = await dbApi.get("jobs");

        if (!data) {
          dispatch(recruiterActions.setRecruiterJobs([]));

          return;
        }

        const jobsArray = Object.entries(data)
          .map(([id, value]) => ({
            id,
            ...value,
          }))
          .filter((job) => job.recruiterId === userId);

        dispatch(recruiterActions.setRecruiterJobs(jobsArray));
      } catch (err) {
        dispatch(recruiterActions.setError(err.message));
      } finally {
        dispatch(recruiterActions.setLoading(false));
      }
    };

    fetchJobs();
  }, [dispatch, userId]);

  return (
    <div className={classes.dashboard}>
      {/* SIDEBAR */}

      <aside className={classes.sidebar}>
        <h2>Recruiter Panel</h2>

        <button
          onClick={() => dispatch(recruiterActions.setActiveView("create"))}
        >
          + Create Job
        </button>

        <button
          onClick={() => dispatch(recruiterActions.setActiveView("jobs"))}
        >
          My Jobs
        </button>

        <button
          onClick={() =>
            dispatch(recruiterActions.setActiveView("applications"))
          }
        >
          Applications
        </button>
      </aside>

      {/* MAIN CONTENT */}

      <main className={classes.content}>
        {activeView === "create" && <CreateJob />}

        {activeView === "jobs" && <MyJobs />}

        {activeView === "applications" && <RecruiterApplications />}
      </main>
    </div>
  );
};

export default RecruiterDashboard;
