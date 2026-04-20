import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/RecruiterDashboard/RecruiterApplications.module.css";

import { recruiterActions } from "../../../store/recruiterSlice";

const RecruiterApplications = () => {
  const dispatch = useDispatch();

  const applications = useSelector(
    (state) => state.recruiter.recruiterApplications,
  );

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchApplications = async () => {
      const jobsData = await dbApi.get("jobs");

      if (!jobsData) return;

      const recruiterJobIds = Object.entries(jobsData)

        .filter(([_, job]) => job.recruiterId === userId)

        .map(([id]) => id);

      const applicationsData = await dbApi.get("applications");

      if (!applicationsData) return;

      const filteredApplications = Object.entries(applicationsData)

        .map(([id, value]) => ({
          id,
          ...value,
        }))

        .filter((app) => recruiterJobIds.includes(app.jobId));

      dispatch(recruiterActions.setRecruiterApplications(filteredApplications));
    };

    fetchApplications();
  }, [dispatch, userId]);

  return (
    <div className={classes.container}>
      <h1>Applications Received</h1>

      {applications.length === 0 && <p>No applications yet</p>}

      <div className={classes.grid}>
        {applications.map((app) => (
          <div key={app.id} className={classes.card}>
            <div className={classes.label}>Applicant ID</div>

            <div className={classes.value}>{app.userId}</div>

            <div className={classes.label}>Job ID</div>

            <div className={classes.value}>{app.jobId}</div>

            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={classes.resumeLink}
            >
              View Resume
            </a>

            <div className={`${classes.statusBadge} ${classes[app.status]}`}>
              {app.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterApplications;
