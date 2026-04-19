import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/AdminDashboard/PendingJobs.module.css";

const PendingJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await dbApi.get("jobs");

      if (!data) return;

      const pendingJobs = Object.entries(data)

        .map(([id, value]) => ({
          id,

          ...value,
        }))

        .filter((job) => job.status === "pending");

      setJobs(pendingJobs);
    };

    fetchJobs();
  }, []);

  const approveHandler = async (jobId) => {
    await dbApi.patch(
      `jobs/${jobId}`,

      { status: "approved" },
    );

    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const rejectHandler = async (jobId) => {
    await dbApi.patch(
      `jobs/${jobId}`,

      { status: "rejected" },
    );

    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  return (
    <>
      <h1 className={classes.title}>Pending Job Approvals</h1>

      {jobs.length === 0 && <p className={classes.empty}>No pending jobs 🎉</p>}

      <div className={classes.jobGrid}>
        {jobs.map((job) => (
          <div key={job.id} className={classes.jobCard}>
            <div className={classes.headerRow}>
              <div className={classes.jobTitle}>{job.title}</div>

              <span className={classes.status}>pending</span>
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

            <div className={classes.cardBtns}>
              <button
                className={classes.approveBtn}
                onClick={() => approveHandler(job.id)}
              >
                Approve
              </button>

              <button
                className={classes.rejectBtn}
                onClick={() => rejectHandler(job.id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PendingJobs;
