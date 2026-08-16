import { FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

import styles from "./AllJobsCard.module.css";

const AllJobsCard = ({ job }) => {
  const isRejected = job.status === "rejected";

  const isClosed = !isRejected && job.jobOpeningStatus === "closed";

  const statusLabel = isRejected
    ? "Rejected"
    : isClosed
      ? "Recruitment Closed"
      : "Approved";

  const statusClass = isRejected
    ? styles.rejected
    : isClosed
      ? styles.closed
      : styles.approved;

  return (
    <article className={styles.card}>
      {/* =================================================
          HEADER
      ================================================= */}

      <header className={styles.header}>
        <div className={styles.heading}>
          <h3 className={styles.title}>{job.title}</h3>

          <p className={styles.company}>
            {job.companyName || "Company not specified"}
          </p>
        </div>

        <span className={`${styles.status} ${statusClass}`}>{statusLabel}</span>
      </header>

      {/* =================================================
          RECRUITER
      ================================================= */}

      <div className={styles.recruiter}>
        <span>Recruiter</span>

        <strong>{job.recruiterEmail || "Not specified"}</strong>
      </div>

      {/* =================================================
          META
      ================================================= */}

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span>
            <FaMapMarkerAlt />
            Location
          </span>

          <strong>{job.location || "Not specified"}</strong>
        </div>

        <div className={styles.metaItem}>
          <span>Package</span>

          <strong>₹{job.salary || "Not specified"}</strong>
        </div>
      </div>

      {/* =================================================
          SKILLS
      ================================================= */}

      {job.skillsRequired && (
        <div className={styles.skills}>{job.skillsRequired}</div>
      )}

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      {job.description && (
        <p className={styles.description}>{job.description}</p>
      )}

      {/* =================================================
          REJECTION REASON
      ================================================= */}

      {isRejected && job.rejectionReason && (
        <div className={styles.rejection}>
          <span>Rejection Reason</span>

          <p>{job.rejectionReason}</p>
        </div>
      )}
    </article>
  );
};

export default AllJobsCard;
