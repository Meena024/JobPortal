import Badge from "../../../../ui/Badge/Badge";

import styles from "../MyJobs.module.css";

const JobCard = ({ job, children }) => {
  return (
    <article className={`card ${styles.jobCard}`}>
      <header className={styles.header}>
        <div>
          <h3>{job.title}</h3>
          <p>{job.companyName}</p>
        </div>

        <Badge status={job.status} />
      </header>

      <div className={styles.meta}>
        <div>
          <span>Location</span>
          <strong>{job.location}</strong>
        </div>

        <div>
          <span>Package</span>
          <strong>{job.package || "Not specified"}</strong>
        </div>

        <div>
          <span>Opening</span>
          <strong>{job.jobOpeningStatus || "Open"}</strong>
        </div>
      </div>

      <div className={styles.skills}>{job.skillsRequired}</div>

      <p className={styles.description}>{job.description}</p>

      {job.status === "rejected" && job.rejectionReason && (
        <div className={styles.rejection}>
          <span>Reason for Rejection:</span>
          <strong>{job.rejectionReason}</strong>
        </div>
      )}

      {job.jobOpeningStatus === "closed" && (
        <div className={styles.closed}>Recruitment Closed</div>
      )}

      {children && <footer className={styles.actions}>{children}</footer>}
    </article>
  );
};

export default JobCard;
