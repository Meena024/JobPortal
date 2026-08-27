import { useState } from "react";
import { useDispatch } from "react-redux";

import { submitInterviewFeedback } from "../../../../store/recruiterActions";

import RescheduleForm from "./RescheduleForm";
import FeedbackPanel from "./FeedbackPanel";

import styles from "./InterviewActions.module.css";

const InterviewActions = ({
  interview,
  interviewData,
  interviewCompleted,
  expired,
  recruitmentClosed,
  onReschedule,
}) => {
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);

  const rescheduleRequest = interviewData.rescheduleRequest || {};

  const recruiterFeedback = interviewData.recruiterFeedback || {};

  const handleSubmitFeedback = async (feedback) => {
    try {
      await dispatch(submitInterviewFeedback(interview, feedback));
    } catch (error) {
      console.error("Unable to save interview feedback:", error);

      window.alert("Unable to save interview feedback.");
    }
  };

  const handleSaveReschedule = async (date, time, reason) => {
    await onReschedule(interview, date, time, reason);

    setEditMode(false);
  };

  const handleCancelReschedule = () => {
    setEditMode(false);
  };

  /* =====================================================
     RECRUITMENT CLOSED
  ===================================================== */

  if (recruitmentClosed) {
    return (
      <section className={styles.actions}>
        <p className={styles.message}>Recruitment for this job is closed.</p>
      </section>
    );
  }

  /* =====================================================
     INTERVIEW COMPLETED
  ===================================================== */

  if (interviewCompleted) {
    return (
      <section className={styles.actions}>
        <FeedbackPanel
          mode="completed"
          feedback={recruiterFeedback.comments}
          submittedAt={recruiterFeedback.submittedAt}
        />
      </section>
    );
  }

  /* =====================================================
     RESCHEDULE MODE
  ===================================================== */

  if (editMode) {
    return (
      <section className={styles.actions}>
        <RescheduleForm
          interview={interview}
          onSave={handleSaveReschedule}
          onCancel={handleCancelReschedule}
        />
      </section>
    );
  }

  /* =====================================================
     NORMAL ACTION STATE
  ===================================================== */

  return (
    <section className={styles.actions}>
      {rescheduleRequest.rescheduleRequested && (
        <div className={styles.requestBox}>
          <div className={styles.requestHeader}>
            <strong>Reschedule Request</strong>

            <span className="badge badge--warning badge--small">Requested</span>
          </div>

          <p>{rescheduleRequest.rescheduleRequestReason}</p>

          {rescheduleRequest.rescheduleRequestedAt && (
            <small>
              Requested{" "}
              {new Date(
                rescheduleRequest.rescheduleRequestedAt,
              ).toLocaleString()}
            </small>
          )}
        </div>
      )}

      {!expired && (
        <button
          type="button"
          className="btn btn--primary"
          onClick={() =>
            window.open(
              interviewData.interviewLink,
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          Join Meeting
        </button>
      )}

      {expired && (
        <FeedbackPanel mode="pending" onSubmit={handleSubmitFeedback} />
      )}

      <button
        type="button"
        className="btn btn--secondary"
        onClick={() => setEditMode(true)}
      >
        {expired
          ? "Reschedule Interview"
          : rescheduleRequest.rescheduleRequested
            ? "Respond to Request"
            : "Reschedule"}
      </button>
    </section>
  );
};

export default InterviewActions;
