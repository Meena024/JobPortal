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

        /* GET ONLY RECRUITER JOBS */

        const recruiterJobs = Object.entries(jobsData)

          .filter(([_, job]) => job.recruiterId === userId)

          .reduce((acc, [id, value]) => {
            acc[id] = value;

            return acc;
          }, {});

        /* ENRICH APPLICATION DATA */

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

      {applications.length === 0 && (
        <p className={classes.emptyState}>No applications yet</p>
      )}

      <div className={classes.grid}>
        {applications.map((app) => (
          <div key={app.id} className={classes.card}>
            {/* HEADER */}

            <div className={classes.cardHeader}>
              <h3>{app.jobTitle}</h3>

              <span className={`${classes.statusBadge} ${classes[app.status]}`}>
                {app.status}
              </span>
            </div>

            {/* APPLICANT */}

            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Applicant</span>

              <span className={classes.metaValue}>{app.applicantEmail}</span>
            </div>

            {/* DATE */}

            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Applied On</span>

              <span className={classes.metaValue}>
                {new Date(app.appliedAt).toLocaleDateString()}
              </span>
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

export default RecruiterApplications;
