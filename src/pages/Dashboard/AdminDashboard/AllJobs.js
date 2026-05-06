import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/AdminDashboard/AllJobs.module.css";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  /*
    FETCH APPROVED + REJECTED JOBS
  */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await dbApi.get("jobs");

        if (!data) {
          setJobs([]);
          return;
        }

        const filteredJobs = Object.entries(data)
          .map(([id, value]) => ({
            id,
            ...value,
          }))
          // ✅ ONLY APPROVED + REJECTED
          .filter(
            (job) => job.status === "approved" || job.status === "rejected",
          );

        setJobs(filteredJobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <h1 className={classes.title}>All Processed Jobs</h1>

      {/* LOADING */}

      {loading && <p className={classes.info}>Loading jobs...</p>}

      {/* EMPTY */}

      {!loading && jobs.length === 0 && (
        <p className={classes.empty}>No jobs found</p>
      )}

      {/* GRID */}

      <div className={classes.jobGrid}>
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`${classes.jobCard} ${classes[job.status]}`}
          >
            <div className={classes.headerRow}>
              <div className={classes.jobTitle}>{job.title}</div>

              <span
                className={`${classes.status} ${classes[`${job.status}Badge`]}`}
              >
                {job.status}
              </span>
            </div>

            <div className={classes.metaRow}>
              <div className={classes.metaBlock}>
                <span>Company</span>
                <p>{job.companyName}</p>
              </div>

              <div className={classes.metaBlock}>
                <span>Location</span>
                <p>{job.location}</p>
              </div>
            </div>

            <div className={classes.skills}>{job.skillsRequired}</div>

            <div className={classes.description}>{job.description}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AllJobs;
