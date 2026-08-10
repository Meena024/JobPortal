import styles from "../../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/InterviewScheduler.module.css";

const InterviewPreview = ({ app, setEditing, cancelInterview }) => {
  const interview = app.interviewData;
  const interviewCompleted = interview.interviewStatus === "completed";

  if (!interview?.interviewScheduled) return null;

  return (
    <div
      className={`${styles.preview} ${
        !interviewCompleted &&
        new Date(`${interview.interviewDate}T${interview.interviewTime}`) <
          new Date()
          ? styles.interviewPendingReview
          : ""
      }`}
    >
      <div className={styles.left}>
        <div className={styles.title}>
          {interviewCompleted ? "Interview Completed" : "Interview Scheduled"}
        </div>

        {interviewCompleted ? (
          <>
            <div className={styles.meta}>
              <strong>Status:</strong> Completed
            </div>

            <div className={styles.feedbackBox}>
              <strong>Recruiter Feedback</strong>

              <div className={styles.feedbackText}>
                {interview.recruiterFeedback?.comments}
              </div>

              <div className={styles.feedbackDate}>
                Submitted{" "}
                {new Date(
                  interview.recruiterFeedback?.submittedAt,
                ).toLocaleString()}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.meta}>
              <strong>Date:</strong> {interview.interviewDate}
            </div>

            <div className={styles.meta}>
              <strong>Time:</strong> {interview.interviewTime}
            </div>

            {new Date(`${interview.interviewDate}T${interview.interviewTime}`) <
              new Date() && (
              <div className={styles.pendingReview}>
                Interview time has passed.
                <br />
                Waiting for recruiter to submit interview feedback.
              </div>
            )}

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.editBtn}
                onClick={() => setEditing(true)}
              >
                Edit
              </button>

              <button
                type="button"
                className={styles.cancelInterviewBtn}
                onClick={cancelInterview}
              >
                Cancel Interview
              </button>
            </div>
          </>
        )}
      </div>

      <div className={styles.right}>
        {!interviewCompleted && (
          <>
            {interview.interviewLink && (
              <a
                href={interview.interviewLink}
                target="_blank"
                rel="noreferrer"
                className={styles.join}
              >
                Join Meeting
              </a>
            )}

            {interview.interviewInstructions && (
              <div className={styles.instructions}>
                {interview.interviewInstructions}
              </div>
            )}

            {interview.rescheduleRequest?.rescheduleRequested && (
              <div className={styles.pendingRequest}>
                Candidate has requested a reschedule.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewPreview;
