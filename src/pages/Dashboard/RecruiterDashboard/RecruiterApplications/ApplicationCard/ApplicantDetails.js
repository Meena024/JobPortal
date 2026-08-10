import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/ApplicantDetails.module.css";
import RecruiterNotes from "./RecruiterNotes";

const ApplicantDetails = ({ app }) => {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.label}>Applicant</span>
        <span className={styles.value}>{app.applicantEmail}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Applied</span>
        <span className={styles.value}>
          {new Date(app.appliedAt).toLocaleDateString()}
        </span>
      </div>

      <div className={styles.resumeRow}>
        <a
          href={app.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.resumeLink}
        >
          View Resume
        </a>
      </div>
      <RecruiterNotes app={app} disabled={recruitmentClosed} />
    </div>
  );
};

export default ApplicantDetails;
