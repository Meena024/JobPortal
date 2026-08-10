import styles from "../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/ApplicantInfo.module.css";

const ApplicantInfo = ({ app }) => {
  const appliedDate = app.appliedAt
    ? new Date(app.appliedAt).toLocaleDateString()
    : "-";

  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <div className={styles.row}>
          <span className={styles.label}>Applicant</span>

          <span className={styles.value}>{app.applicantEmail}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Applied</span>

          <span className={styles.value}>{appliedDate}</span>
        </div>
      </div>

      <a
        href={app.resumeUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.resumeBtn}
      >
        View Resume
      </a>
    </div>
  );
};

export default ApplicantInfo;
