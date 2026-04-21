import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/AdminDashboard/Applications.module.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsData = await dbApi.get("applications");

        const jobsData = await dbApi.get("jobs");

        const usersData = await dbApi.get("users");

        if (!applicationsData) return;

        const enrichedApplications = Object.entries(applicationsData)

          .map(([id, app]) => ({
            id,

            ...app,

            jobTitle: jobsData?.[app.jobId]?.title || "Unknown Job",

            applicantEmail:
              usersData?.[app.userId]?.profile?.email || "Unknown User",
          }));

        setApplications(enrichedApplications);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <>
      <h1 className={classes.title}>Job Applications</h1>

      {applications.length === 0 && (
        <p className={classes.empty}>No applications yet</p>
      )}

      <div className={classes.applicationGrid}>
        {applications.map((app) => (
          <div key={app.id} className={classes.applicationCard}>
            <div className={classes.label}>Applicant</div>

            <div className={classes.value}>{app.applicantEmail}</div>

            <div className={classes.label}>Job Title</div>

            <div className={classes.value}>{app.jobTitle}</div>

            <div className={classes.label}>Applied On</div>

            <div className={classes.value}>
              {new Date(app.appliedAt).toLocaleDateString()}
            </div>

            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={classes.resumeBtn}
            >
              View Resume
            </a>

            {app.status && (
              <span className={`${classes.status} ${classes[app.status]}`}>
                {app.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Applications;
