import classes from "../../../Styling/Pages/RecruiterDashboard/RecruitersDashboard.module.css";

import { useDispatch, useSelector } from "react-redux";

import { recruiterActions } from "../../../store/recruiterSlice";

import CreateJob from "./CreateJob";
import MyJobs from "./MyJobs";
import RecruiterApplications from "./RecruiterApplications/RecruiterApplications";
import RecruiterInterviews from "./RecruiterInterviews/RecruiterInterviews";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();

  const activeView = useSelector((state) => state.recruiter.activeView);

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
        <button
          onClick={() => dispatch(recruiterActions.setActiveView("interviews"))}
        >
          Interviews
        </button>
      </aside>

      {/* MAIN CONTENT */}

      <main className={classes.content}>
        {activeView === "create" && <CreateJob />}

        {activeView === "jobs" && <MyJobs />}

        {activeView === "applications" && <RecruiterApplications />}

        {activeView === "interviews" && <RecruiterInterviews />}
      </main>
    </div>
  );
};

export default RecruiterDashboard;
