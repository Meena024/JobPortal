import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { dbApi } from "../../../../services/dbApi";
import { recruiterActions } from "../../../../store/recruiterSlice";

import ApplicationCard from "./ApplicationCard";
import styles from "./../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/RecruiterApplications.module.css";

const RecruiterApplications = () => {
  const dispatch = useDispatch();

  const applications = useSelector(
    (state) => state.recruiter.recruiterApplications,
  );

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchApplications = async () => {
      const jobsData = await dbApi.get("jobs");
      const usersData = await dbApi.get("users");
      const applicationsData = await dbApi.get("applications");

      if (!jobsData || !applicationsData) return;

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

      dispatch(recruiterActions.setRecruiterApplications(enrichedApplications));
    };

    fetchApplications();
  }, [dispatch, userId]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Applications Received</h1>

      <div className={styles.list}>
        {applications.map((app) => (
          <ApplicationCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
};

export default RecruiterApplications;
