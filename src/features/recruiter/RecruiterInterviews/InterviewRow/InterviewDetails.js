import styles from "./InterviewDetails.module.css";

const InterviewDetails = ({
  interview,
  interviewData,
  interviewCompleted,
  expired,
}) => {
  const interviewDate = interviewData.interviewDate || "";
  const interviewTime = interviewData.interviewTime || "";

  let statusLabel = "Scheduled";
  let statusClass = "badge--info";

  if (interviewCompleted) {
    statusLabel = "Completed";
    statusClass = "badge--success";
  } else if (expired) {
    statusLabel = "Awaiting Confirmation";
    statusClass = "badge--warning";
  }

  return (
    <section className={styles.details}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h3 className="card-title">{interview.jobTitle}</h3>

          <p className="card-subtitle">{interview.applicantEmail}</p>
        </div>

        <span className={`badge ${statusClass}`}>{statusLabel}</span>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span>Date</span>
          <strong>{new Date(interviewDate).toLocaleDateString()}</strong>
        </div>

        <div className={styles.metaItem}>
          <span>Time [24 hrs clock]</span>
          <strong>{interviewTime} IST</strong>
        </div>
      </div>

      {interview.recruiterNotes && (
        <div className={styles.info}>
          <span>Recruiter Notes</span>

          <p>{interview.recruiterNotes}</p>
        </div>
      )}

      {interviewData.interviewInstructions && (
        <div className={styles.info}>
          <span>Instructions</span>

          <p>{interviewData.interviewInstructions}</p>
        </div>
      )}
    </section>
  );
};

export default InterviewDetails;
