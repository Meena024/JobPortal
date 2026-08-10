import { useSelector } from "react-redux";

import ApplicationHeader from "./ApplicationHeader";
import ApplicationStatusActions from "./ApplicationStatusActions";
import ApplicantInfo from "./ApplicantInfo";
import RecruiterNotes from "./RecruiterNotes";
import InterviewScheduler from "./InterviewScheduler/InterviewScheduler";
import OfferLetterSection from "./OfferLetterSection/OfferLetterSection";

import styles from "../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/ApplicationCard.module.css";

const ApplicationCard = ({ app }) => {
  const recruiterJobs = useSelector(
    (state) => state.recruiter.recruiterJobs || [],
  );

  const relatedJob = recruiterJobs.find((job) => job.id === app.jobId);

  const recruitmentClosed = relatedJob?.jobOpeningStatus === "closed";

  return (
    <div
      className={`${styles.card} ${
        recruitmentClosed ? styles.closedRecruitment : styles[app.status]
      }`}
    >
      <ApplicationHeader app={app} recruitmentClosed={recruitmentClosed} />

      <ApplicantInfo app={app} />

      <ApplicationStatusActions app={app} disabled={recruitmentClosed} />

      <RecruiterNotes app={app} disabled={recruitmentClosed} />

      {!recruitmentClosed && app.status === "shortlisted" && (
        <InterviewScheduler app={app} />
      )}

      {!recruitmentClosed && app.status === "selected" && (
        <OfferLetterSection app={app} />
      )}

      {recruitmentClosed && (
        <div className={styles.closedMessage}>
          Recruitment has been closed for this job opening. Candidate processing
          has been locked.
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
