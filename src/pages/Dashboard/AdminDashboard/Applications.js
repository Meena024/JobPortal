import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/AdminDashboard/Applications.module.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const data = await dbApi.get("applications");

      if (!data) return;

      const arr = Object.entries(data)

        .map(([id, value]) => ({
          id,

          ...value,
        }));

      setApplications(arr);
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
            <div className={classes.label}>Applicant ID</div>

            <div className={classes.value}>{app.userId}</div>

            <div className={classes.label}>Job ID</div>

            <div className={classes.value}>{app.jobId}</div>

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
