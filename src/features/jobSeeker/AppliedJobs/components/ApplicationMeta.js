import styles from "../AppliedJobs.module.css";

const ApplicationMeta = ({ app }) => {
  return (
    <div className={styles.metaRow}>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Location</span>

        <span className={styles.metaValue}>{app.location}</span>
      </div>

      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Package</span>

        <span className={styles.metaValue}>
          <strong>{app.package !== "-" ? app.package : "-"}</strong>
        </span>
      </div>

      {app.resumeUrl && (
        <button
          type="button"
          className={styles.resumeLink}
          onClick={() =>
            window.open(app.resumeUrl, "_blank", "noopener,noreferrer")
          }
        >
          View Resume
        </button>
      )}
    </div>
  );
};

export default ApplicationMeta;
