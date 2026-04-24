import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/JobSeekerDashboard/AppliedJobs.module.css";

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsData = await dbApi.get("applications");

        const jobsData = await dbApi.get("jobs");

        if (!applicationsData) {
          setApplications([]);

          return;
        }

        const arr = Object.entries(applicationsData)

          .map(([id, value]) => ({
            id,
            ...value,
          }))

          .filter((app) => app.userId === userId)

          .map((app) => {
            const job = jobsData?.[app.jobId];

            return {
              ...app,

              jobTitle: job?.title || "Job removed",

              companyName: job?.companyName || "Unknown company",

              description:
                job?.description || "This job is no longer available.",

              salary: job?.salary || "-",

              jobExists: !!job,
            };
          });

        setApplications(arr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId]);

  return (
    <div>
      <h1>Applied Jobs</h1>

      {/* LOADING STATE */}

      {loading && (
        <p className={classes.infoMessage}>Loading applications...</p>
      )}

      {/* EMPTY STATE */}

      {!loading && applications.length === 0 && (
        <p className={classes.infoMessage}>No applications yet</p>
      )}

      {/* APPLICATION GRID */}

      <div className={classes.grid}>
        {applications.map((app) => (
          <div key={app.id} className={classes.card}>
            {/* TITLE + STATUS */}

            <div className={classes.titleRow}>
              <h3>{app.jobTitle}</h3>

              <span className={classes.status}>{app.status}</span>
            </div>

            {/* JOB REMOVED WARNING */}

            {!app.jobExists && (
              <span className={classes.removedBadge}>
                Job no longer available
              </span>
            )}

            {/* COMPANY */}

            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Company:</span>{" "}
              {app.companyName}
            </div>

            {/* DESCRIPTION */}

            <p className={classes.description}>{app.description}</p>

            {/* SALARY */}

            <div className={classes.salary}>
              {app.salary !== "-" ? `₹ ${app.salary}` : "-"}
            </div>

            {/* RESUME BUTTON */}

            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={classes.resumeBtn}
            >
              View Resume
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedJobs;
