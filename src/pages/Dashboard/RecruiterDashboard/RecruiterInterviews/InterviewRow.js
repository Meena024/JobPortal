import { useState } from "react";
import { useDispatch } from "react-redux";

import { submitInterviewFeedback } from "../../../../store/recruiterActions";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterInterviews.module.css";

const InterviewRow = ({
  interview,
  recruitmentClosed,
  rescheduleInterview,
}) => {
  const dispatch = useDispatch();

  const interviewData = interview.interviewData || {};

  const rescheduleRequest = interviewData.rescheduleRequest || {};

  const rescheduleHistory = interviewData.rescheduleHistory || [];

  const recruiterFeedback = interviewData.recruiterFeedback || {};

  const interviewCompleted = interviewData.interviewStatus === "completed";

  const interviewDateTime = new Date(
    `${interviewData.interviewDate}T${interviewData.interviewTime}`,
  );

  const expired = Date.now() >= interviewDateTime.getTime();

  const [editMode, setEditMode] = useState(false);

  const [date, setDate] = useState(interviewData.interviewDate || "");

  const [time, setTime] = useState(interviewData.interviewTime || "");

  const [reason, setReason] = useState("");

  const [feedback, setFeedback] = useState(recruiterFeedback.comments || "");

  const saveHandler = () => {
    if (interviewCompleted) return;

    rescheduleInterview(interview, date, time, reason);

    setReason("");
    setEditMode(false);
  };

  const cancelHandler = () => {
    setDate(interviewData.interviewDate || "");

    setTime(interviewData.interviewTime || "");

    setReason("");

    setEditMode(false);
  };

  const submitFeedbackHandler = async () => {
    if (!feedback.trim()) {
      alert("Enter interview performance.");

      return;
    }

    const confirmed = window.confirm(
      "Submit interview feedback?\n\nOnce submitted it cannot be edited.",
    );

    if (!confirmed) return;

    try {
      await dispatch(submitInterviewFeedback(interview, feedback));
    } catch (err) {
      console.error(err);

      alert("Unable to save interview feedback.");
    }
  };
  return (
    <div
      className={`${styles.row}
      ${expired ? styles.expired : ""}
      ${recruitmentClosed ? styles.inactiveRow : ""}
    `}
    >
      <div className={styles.col1}>
        <div>
          <strong>Job:</strong> {interview.jobTitle}
        </div>

        <div>
          <strong>Applicant:</strong> {interview.applicantEmail}
        </div>

        <div>
          <strong>Date:</strong> {interviewData.interviewDate}
        </div>

        <div>
          <strong>Time:</strong> {interviewData.interviewTime}
        </div>

        <div>
          <strong>Status:</strong>{" "}
          {interviewCompleted ? "Completed" : "Scheduled"}
        </div>

        {interview.recruiterNotes && (
          <div>
            <strong>Notes:</strong> {interview.recruiterNotes}
          </div>
        )}

        {interviewData.interviewInstructions && (
          <div>
            <strong>Instructions:</strong> {interviewData.interviewInstructions}
          </div>
        )}
      </div>

      <div className={styles.col2}>
        {rescheduleHistory.length > 0 && (
          <>
            <strong>History</strong>

            <div className={styles.history}>
              {rescheduleHistory
                .slice()
                .reverse()
                .map((item, index) => (
                  <div key={index} className={styles.historyItem}>
                    <div>
                      Previous Date : {item.previousDate} at {item.previousTime}
                    </div>

                    <div className={styles.reason}>{item.reason}</div>

                    {item.changedAt && (
                      <div className={styles.requestTime}>
                        {new Date(item.changedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.col3}>
        {recruitmentClosed ? (
          <div className={styles.closedState}>
            <span className={styles.closedBadge}>Recruitment Closed</span>
          </div>
        ) : interviewCompleted ? (
          <span className={styles.completedBadge}>Interview Completed</span>
        ) : !expired ? (
          <a
            href={interviewData.interviewLink}
            target="_blank"
            rel="noreferrer"
            className={styles.joinBtn}
          >
            Join Meeting
          </a>
        ) : (
          <span className={styles.disabled}>Waiting for Feedback</span>
        )}

        {!recruitmentClosed &&
          !interviewCompleted &&
          rescheduleRequest.rescheduleRequested &&
          !editMode && (
            <button
              className={styles.acceptBtn}
              onClick={() => setEditMode(true)}
            >
              Respond to Request
            </button>
          )}

        {!recruitmentClosed &&
          !interviewCompleted &&
          !editMode &&
          !rescheduleRequest.rescheduleRequested && (
            <button
              className={styles.rescheduleBtn}
              onClick={() => setEditMode(true)}
            >
              Reschedule
            </button>
          )}

        {rescheduleRequest.rescheduleRequested && (
          <div className={styles.requestBox}>
            <strong>Reschedule Request</strong>

            <div className={styles.requestReason}>
              {rescheduleRequest.rescheduleRequestReason}
            </div>

            {rescheduleRequest.rescheduleRequestedAt && (
              <div className={styles.requestTime}>
                Requested at{" "}
                {new Date(
                  rescheduleRequest.rescheduleRequestedAt,
                ).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {!recruitmentClosed && !interviewCompleted && editMode && (
          <div className={styles.rescheduleBox}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <textarea
              placeholder="Reason for reschedule"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className={styles.actionBtns}>
              <button className={styles.saveBtn} onClick={saveHandler}>
                Save
              </button>

              <button className={styles.cancelBtn} onClick={cancelHandler}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {expired && !interviewCompleted && !recruitmentClosed && (
          <div className={styles.feedbackBox}>
            <strong>Candidate Performance</strong>

            <textarea
              className={styles.feedbackTextarea}
              placeholder="Enter interview performance..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <button
              className={styles.submitFeedbackBtn}
              onClick={submitFeedbackHandler}
            >
              Submit Feedback
            </button>
          </div>
        )}

        {interviewCompleted && (
          <div className={styles.completedFeedback}>
            <strong>Candidate Performance</strong>

            <p>{recruiterFeedback.comments}</p>

            {recruiterFeedback.submittedAt && (
              <small>
                Submitted on{" "}
                {new Date(recruiterFeedback.submittedAt).toLocaleString()}
              </small>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRow;
