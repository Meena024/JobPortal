import { useState } from "react";
import { useDispatch } from "react-redux";

import { approveOrRejectJob } from "../../../store/adminActions";

import styles from "./ApprovalJobCard.module.css";

const ApprovalJobCard = ({ job }) => {
  const dispatch = useDispatch();

  const [rejectionReason, setRejectionReason] = useState("");

  /* =====================================================
     APPROVE / REJECT
  ===================================================== */

  const handleStatusChange = (status) => {
    const reason = rejectionReason.trim();

    if (status === "rejected" && !reason) {
      window.alert("Please provide a reason before rejecting this job.");

      return;
    }

    dispatch(
      approveOrRejectJob(job, status, status === "rejected" ? reason : ""),
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <article className={styles.card}>
      {/* =================================================
          JOB HEADER
      ================================================= */}

      <header className={styles.header}>
        <h3 className={styles.title}>{job.title}</h3>

        <p className={styles.company}>
          {job.companyName || "Company not specified"}
        </p>
      </header>

      {/* =================================================
          LOCATION / PACKAGE
      ================================================= */}

      <div className={styles.meta}>
        <div className={styles.metaBlock}>
          <span>Location</span>

          <p>{job.location || "Not specified"}</p>
        </div>

        <div className={styles.metaBlock}>
          <span>Package</span>

          <p>{job.salary || "Not specified"}</p>
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

      <textarea
        className={`${styles.rejectionInput} textarea`}
        placeholder="Add a reason if rejecting this job recruitment..."
        value={rejectionReason}
        onChange={(event) => setRejectionReason(event.target.value)}
      />

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className={styles.actions}>
        <button
          type="button"
          className="btn btn--success"
          onClick={() => handleStatusChange("approved")}
        >
          Approve
        </button>

        <button
          type="button"
          className="btn btn--danger"
          onClick={() => handleStatusChange("rejected")}
        >
          Reject
        </button>
      </div>
    </article>
  );
};

export default ApprovalJobCard;
