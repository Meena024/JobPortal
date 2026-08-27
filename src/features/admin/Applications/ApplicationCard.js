import styles from "./ApplicationCard.module.css";

const STATUS_CLASS_MAP = {
  pending: styles.pending,
  reviewed: styles.reviewed,
  shortlisted: styles.shortlisted,
  selected: styles.selected,
  rejected: styles.rejected,
};

const BADGE_CLASS_MAP = {
  pending: styles.badgePending,
  reviewed: styles.badgeReviewed,
  shortlisted: styles.badgeShortlisted,
  selected: styles.badgeSelected,
  rejected: styles.badgeRejected,
};

const capitalize = (value) => {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

const ApplicationCard = ({ application, recruitmentClosed }) => {
  const status = application.status || "";

  const statusLabel = capitalize(status);

  const statusClass = STATUS_CLASS_MAP[status] || "";

  const badgeClass = BADGE_CLASS_MAP[status] || styles.status;

  return (
    <article
      className={`${styles.card} ${
        recruitmentClosed ? styles.cardClosed : statusClass
      }`}
    >
      {/* =================================================
          STATUS
      ================================================= */}

      <div className={styles.statusContainer}>
        <span className={`${styles.status} ${badgeClass}`}>
          {statusLabel || "Unknown"}
        </span>

        {recruitmentClosed && (
          <span className={styles.closedBadge}>Recruitment Closed</span>
        )}
      </div>

      {/* =================================================
          INFORMATION
      ================================================= */}

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Applicant</span>

          <span className={styles.value}>
            {application.applicantEmail || "Unknown"}
          </span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Job Title</span>

          <span className={styles.value}>
            {application.jobTitle || "Unknown"}
          </span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Recruiter</span>

          <span className={styles.value}>
            {application.recruiterEmail || "Unknown"}
          </span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Applied On</span>

          <span className={styles.value}>
            {application.appliedAt
              ? new Date(application.appliedAt).toLocaleDateString()
              : "-"}
          </span>
        </div>
      </div>

      {/* =================================================
          RESUME
      ================================================= */}

      {application.resumeUrl && (
        <button
          type="button"
          className={styles.resume}
          onClick={() =>
            window.open(application.resumeUrl, "_blank", "noopener,noreferrer")
          }
        >
          View Resume
        </button>
      )}
    </article>
  );
};

export default ApplicationCard;
