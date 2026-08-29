import styles from "../AppliedJobs.module.css";

const UpcomingInterview = ({ app }) => {
  const interview = app.interviewData;

  const hasUpcomingInterview =
    app.jobOpeningStatus !== "closed" && interview?.interviewScheduled;

  if (!hasUpcomingInterview) {
    return null;
  }

  const interviewDateTime = new Date(
    `${interview.interviewDate}T${interview.interviewTime}`,
  );

  const isUpcoming =
    !Number.isNaN(interviewDateTime.getTime()) &&
    interviewDateTime.getTime() > Date.now();

  if (!isUpcoming) {
    return null;
  }

  return (
    <div className={styles.interviewRow}>
      <strong className={styles.interviewTitle}>Upcoming Interview</strong>

      <span className={styles.interviewDateTime}>
        {interview.interviewDate} · {interview.interviewTime}
      </span>

      {interview.interviewInstructions && (
        <span className={styles.interviewInstructions}>
          {interview.interviewInstructions}
        </span>
      )}
    </div>
  );
};

export default UpcomingInterview;
