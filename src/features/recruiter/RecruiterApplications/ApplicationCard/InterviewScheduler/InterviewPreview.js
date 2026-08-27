import styles from "./InterviewPreview.module.css";

const INTERVIEW_GRACE_PERIOD = 15 * 60 * 1000;

const InterviewPreview = ({ app, setEditing }) => {
  const interview = app.interviewData || {};

  const interviewDate = interview.interviewDate || "";
  const interviewTime = interview.interviewTime || "";

  const interviewLink = interview.interviewLink || "";

  const interviewInstructions = interview.interviewInstructions || "";

  const rescheduleRequest = interview.rescheduleRequest || {};

  const recruiterFeedback = interview.recruiterFeedback || {};

  const interviewCompleted = interview.interviewStatus === "completed";

  /* =====================================================
     INTERVIEW WINDOW
  ===================================================== */

  const interviewDateTime = new Date(`${interviewDate}T${interviewTime}`);

  const hasValidDate = !Number.isNaN(interviewDateTime.getTime());

  const interviewEndTime = hasValidDate
    ? interviewDateTime.getTime() + INTERVIEW_GRACE_PERIOD
    : null;

  const joinEnabled = hasValidDate && Date.now() < interviewEndTime;

  /* =====================================================
     RENDER
  ===================================================== */

  if (!interview.interviewScheduled) {
    return null;
  }

  return (
    <section className={styles.preview}>
      {/* =================================================
          INTERVIEW DETAILS
      ================================================= */}

      <div className={styles.left}>
        <h4 className={styles.title}>
          {interviewCompleted ? "Interview Completed" : "Interview Scheduled"}
        </h4>

        <div className={styles.meta}>
          <strong>Date:</strong>

          <span>{interviewDate || "-"}</span>

          <strong>Time:</strong>

          <span>{interviewTime || "-"}</span>
        </div>

        {/* ===============================================
            INSTRUCTIONS
        =============================================== */}

        {interviewInstructions && (
          <div className={styles.instructions}>
            <strong>Instructions:</strong> {interviewInstructions}
          </div>
        )}

        {/* ===============================================
            RESCHEDULE REQUEST
        =============================================== */}

        {!interviewCompleted && rescheduleRequest.rescheduleRequested && (
          <div className={styles.pendingRequest}>
            Candidate has requested a reschedule.
          </div>
        )}
      </div>

      {/* =================================================
          ACTIONS / FEEDBACK
      ================================================= */}

      <div className={styles.right}>
        {/* ===============================================
            COMPLETED FEEDBACK
        =============================================== */}

        {interviewCompleted && recruiterFeedback.comments && (
          <div className={styles.feedbackBox}>
            <strong>Feedback:</strong>

            <span>{recruiterFeedback.comments}</span>
          </div>
        )}

        {/* ===============================================
            JOIN MEETING
        =============================================== */}

        {!interviewCompleted &&
          interviewLink &&
          (joinEnabled ? (
            <button
              type="button"
              className={styles.join}
              onClick={() =>
                window.open(interviewLink, "_blank", "noopener,noreferrer")
              }
            >
              Join Meeting
            </button>
          ) : (
            <span className={styles.joinDisabled}>Interview window closed</span>
          ))}

        {/* ===============================================
            RESCHEDULE
        =============================================== */}

        {!interviewCompleted && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setEditing(true)}
          >
            Reschedule Interview
          </button>
        )}
      </div>
    </section>
  );
};

export default InterviewPreview;
