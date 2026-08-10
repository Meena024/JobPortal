import styles from "../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/ApplicationHeader.module.css";

const STATUS_LABELS = {
  pending: "Pending",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  selected: "Selected",
  rejected: "Rejected",
};

const ApplicationHeader = ({ app, recruitmentClosed }) => {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <h3 className={styles.jobTitle}>{app.jobTitle}</h3>

        <span className={`${styles.badge} ${styles[app.status]}`}>
          {STATUS_LABELS[app.status]}
        </span>
      </div>

      <div className={styles.right}>
        {recruitmentClosed && (
          <span className={styles.closedBadge}>Recruitment Closed</span>
        )}
      </div>
    </div>
  );
};

export default ApplicationHeader;
