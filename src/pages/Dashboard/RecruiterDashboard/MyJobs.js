import { dbApi } from "../../../services/dbApi";
import { useDispatch, useSelector } from "react-redux";
import { recruiterActions } from "../../../store/recruiterSlice";
import classes from "../../../Styling/Pages/MyJobs.module.css";

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

  const editHandler = (job) => {
    dispatch(recruiterActions.setEditingJob(job));

    dispatch(recruiterActions.setActiveView("create"));
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>My Job Listings</h1>

      {loading && <p className={classes.info}>Loading jobs...</p>}

      {error && <p className={classes.error}>{error}</p>}

      {!loading && jobs.length === 0 && (
        <p className={classes.info}>No jobs posted yet</p>
      )}

      <div className={classes.jobGrid}>
        {jobs.map((job) => (
          <div key={job.id} className={classes.jobCard}>
            <div className={classes.headerRow}>
              <div className={classes.jobTitle}>{job.title}</div>

              <span className={`${classes.status} ${classes[job.status]}`}>
                {job.status}
              </span>
            </div>

            <div className={classes.metaRow}>
              <div>
                <span>Company</span>
                <p>{job.companyName}</p>
              </div>

              <div>
                <span>Location</span>
                <p>{job.location}</p>
              </div>

              <div>
                <span>Salary</span>
                <p>₹ {job.salary}</p>
              </div>
            </div>

            <div className={classes.skills}>{job.skillsRequired}</div>

            <div className={classes.description}>{job.description}</div>

            <div className={classes.cardBtns}>
              <button onClick={() => editHandler(job)}>Edit</button>

              <button
                className={classes.deleteBtn}
                onClick={() => deleteHandler(job.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobs;
