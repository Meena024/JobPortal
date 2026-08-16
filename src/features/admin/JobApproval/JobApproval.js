import { useMemo } from "react";
import { useSelector } from "react-redux";

import PendingJobCard from "./ApprovalJobCard";

import styles from "./JobApproval.module.css";

const JobApproval = () => {
  const allJobs = useSelector((state) => state.admin.allJobs || []);

  /* =====================================================
     FILTER PENDING JOBS
  ===================================================== */

  const pendingJobs = useMemo(() => {
    return allJobs.filter((job) => job.status === "pending");
  }, [allJobs]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className={styles.page}>
      {/* =================================================
          HEADER
      ================================================= */}

      <header className={styles.header}>
        <h2 className="page-title">Pending Job Approvals</h2>

        <span className={styles.count}>
          {pendingJobs.length} Job
          {pendingJobs.length !== 1 && "s"}
        </span>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      {pendingJobs.length === 0 ? (
        <p className={styles.empty}>No pending jobs.</p>
      ) : (
        <div className={styles.jobGrid}>
          {pendingJobs.map((job) => (
            <PendingJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
};

export default JobApproval;
