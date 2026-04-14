import { dbApi } from "../../../services/dbApi";

import { useDispatch, useSelector } from "react-redux";

import { recruiterActions } from "../../../store/recruiterSlice";

import classes from "../../../Styling/Pages/RecruitersDashboard.module.css";

const MyJobs = () => {
  const jobs = useSelector((state) => state.recruiter.recruiterJobs);

  const loading = useSelector((state) => state.recruiter.loading);

  const error = useSelector((state) => state.recruiter.error);

  const dispatch = useDispatch();

  const deleteHandler = async (jobId) => {
    try {
      await dbApi.remove(`jobs/${jobId}`);

      dispatch(recruiterActions.removeRecruiterJob(jobId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>My Job Listings</h1>

      {loading && <p>Loading jobs...</p>}

      {error && <p>{error}</p>}

      {!loading && jobs.length === 0 && <p>No jobs posted yet.</p>}

      <div className={classes.jobGrid}>
        {jobs.map((job) => (
          <div key={job.id} className={classes.jobCard}>
            <h3>{job.title}</h3>

            <p>{job.companyName}</p>

            <p>{job.location}</p>

            <div className={classes.cardBtns}>
              <button>Edit</button>

              <button onClick={() => deleteHandler(job.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyJobs;
