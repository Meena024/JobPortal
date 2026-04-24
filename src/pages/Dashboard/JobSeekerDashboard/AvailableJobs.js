import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";

import JobApply from "./JobApply";

import classes from "../../../Styling/Pages/JobSeekerDashboard/AvailableJobs.module.css";

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h1>Available Jobs</h1>

      {loading && <p className={classes.infoMessage}>Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p className={classes.infoMessage}>No approved jobs available yet</p>
      )}

      <div className={classes.grid}>
        {jobs.map((job) => (
          <div key={job.id} className={classes.card}>
            {/* TITLE */}

            <div className={classes.titleRow}>
              <h3>
                <strong>{job.title}</strong>
              </h3>
            </div>

            {/* COMPANY */}

            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Company:</span>{" "}
              {job.companyName}
            </div>

            {/* LOCATION */}

            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Location:</span>{" "}
              {job.location}
            </div>

            {/* DESCRIPTION */}

            <p className={classes.description}>{job.description}</p>

            {/* SALARY */}

            <div className={classes.salary}>₹ {job.salary} / Year</div>

            {/* APPLY BUTTON */}

            <JobApply jobId={job.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableJobs;
