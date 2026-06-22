import styles from "./../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/InterviewScheduler.module.css";

const InterviewPreview = ({ app, setEditing, cancelInterview }) => {
  return (
    <div className={styles.preview}>
      <div className={styles.left}>
        <strong className={styles.title}>Interview Scheduled</strong>

        <div className={styles.meta}>{app.interviewData?.interviewDate}</div>

        <div className={styles.meta}>{app.interviewData?.interviewTime}</div>

        <div className={styles.actionRow}>
          <button className={styles.editBtn} onClick={() => setEditing(true)}>
            Edit
          </button>

          <button
            className={styles.cancelInterviewBtn}
            onClick={cancelInterview}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className={styles.right}>
        <a
          href={app.interviewData?.interviewLink}
          target="_blank"
          rel="noreferrer"
          className={styles.join}
        >
          Join Meeting
        </a>

        <div className={styles.instructions}>
          {app.interviewData?.interviewInstructions}
        </div>
      </div>
    </div>
  );
};

export default InterviewPreview;
