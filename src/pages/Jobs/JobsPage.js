import { useEffect, useState } from "react";

import { dbApi } from "../../services/dbApi";

import classes from "../../Styling/Pages/Jobs/JobsPage.module.css";
import JobApply from "./JobApply";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await dbApi.get("jobs");

        if (!data) {
          setJobs([]);

          return;
        }

        const approvedJobs = Object.entries(data)

          .map(([id, value]) => ({
            id,

            ...value,
          }))

          .filter((job) => job.status === "approved");

        setJobs(approvedJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Available Jobs</h1>

      {loading && <p className={classes.info}>Loading jobs...</p>}

      {error && <p className={classes.error}>{error}</p>}

      {!loading && jobs.length === 0 && (
        <p className={classes.info}>No approved jobs available yet</p>
      )}

      <div className={classes.jobGrid}>
        {jobs.map((job) => (
          <div key={job.id} className={classes.jobCard}>
            <div className={classes.headerRow}>
              <h2>{job.title}</h2>

              <span className={classes.badge}>{job.companyName}</span>
            </div>

            <div className={classes.metaRow}>
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

            <JobApply jobId={job.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
