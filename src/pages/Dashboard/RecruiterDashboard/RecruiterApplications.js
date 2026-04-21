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
      try {
        const jobsData = await dbApi.get("jobs");
        const usersData = await dbApi.get("users");
        const applicationsData = await dbApi.get("applications");

        if (!jobsData || !applicationsData) return;

        // recruiter jobs only
        const recruiterJobs = Object.entries(jobsData)
          .filter(([_, job]) => job.recruiterId === userId)
          .reduce((acc, [id, value]) => {
            acc[id] = value;
            return acc;
          }, {});

        const enrichedApplications = Object.entries(applicationsData)
          .map(([id, app]) => {
            if (!recruiterJobs[app.jobId]) return null;

            return {
              id,
              ...app,
              jobTitle: recruiterJobs[app.jobId]?.title || "Unknown Job",
              applicantEmail:
                usersData?.[app.userId]?.profile?.email || "Unknown User",
            };
          })
          .filter(Boolean);

        dispatch(
          recruiterActions.setRecruiterApplications(enrichedApplications),
        );
      } catch (err) {
        console.error(err);
      }
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
