import styles from "../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/StatusSection.module.css";

import StatusActionButtons from "./StatusActionButtons";

const STATUS_LABELS = {
  pending: "Pending",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  selected: "Selected",
  rejected: "Rejected",
};

const StatusSection = ({
  app,
  recruitmentClosed,

  onReview,
  onShortlist,
  onSelect,
  onReject,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>Application Status</span>

        <span
          className={`${styles.badge} ${styles[app.status] || styles.pending}`}
        >
          {STATUS_LABELS[app.status] || app.status}
        </span>
      </div>

      {recruitmentClosed ? (
        <div className={styles.closed}>
          Recruitment has been closed for this job.
        </div>
      ) : (
        <StatusActionButtons
          app={app}
          onReview={onReview}
          onShortlist={onShortlist}
          onSelect={onSelect}
          onReject={onReject}
        />
      )}
    </div>
  );
};

export default StatusSection;
