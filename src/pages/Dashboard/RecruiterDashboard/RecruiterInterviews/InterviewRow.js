import { useState } from "react";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterInterviews.module.css";

const InterviewRow = ({
  interview,
  expired,
  recruitmentClosed,
  rescheduleInterview,
}) => {
  const interviewData = interview.interviewData || {};

  const [editMode, setEditMode] = useState(false);

  const [date, setDate] = useState(interviewData.interviewDate || "");

  const [time, setTime] = useState(interviewData.interviewTime || "");

  const [reason, setReason] = useState("");

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

        {interview.rescheduleRequested && (
          <div className={styles.requestBox}>
            <strong>Reschedule Request:</strong>

            <div className={styles.requestReason}>
              {interview.rescheduleRequestReason}
            </div>

            {interview.rescheduleRequestedAt && (
              <div className={styles.requestTime}>
                Requested at{" "}
                {new Date(interview.rescheduleRequestedAt).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.col2}>
        {interview.rescheduleHistory?.length > 0 && (
          <div>
            <strong>History:</strong>

            <div className={styles.history}>
              {interview.rescheduleHistory
                .slice()
                .reverse()
                .map((item, index) => (
                  <div key={index} className={styles.historyItem}>
                    <div>
                      Previous Date: {item.previousDate} at {item.previousTime}
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
          </div>
        )}
      </div>

      <div className={styles.col3}>
        {recruitmentClosed ? (
          <div className={styles.closedState}>
            <span className={styles.closedBadge}>
              Recruitment Closed. Interview Inactive
            </span>
            <span className={styles.closedText}></span>
          </div>
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
          <span className={styles.disabled}>Meeting Expired</span>
        )}

        {!recruitmentClosed && interview.rescheduleRequested && !editMode && (
          <button
            className={styles.acceptBtn}
            onClick={() => setEditMode(true)}
          >
            Respond to Request
          </button>
        )}

        {!recruitmentClosed && !editMode && !interview.rescheduleRequested && (
          <button
            className={styles.rescheduleBtn}
            onClick={() => setEditMode(true)}
          >
            Reschedule
          </button>
        )}

        {!recruitmentClosed && editMode && (
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
              <button
                className={styles.saveBtn}
                onClick={() => {
                  rescheduleInterview(interview.id, date, time, reason);

                  setReason("");
                  setEditMode(false);
                }}
              >
                Save
              </button>

              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setDate(interviewData.interviewDate || "");
                  setTime(interviewData.interviewTime || "");
                  setReason("");
                  setEditMode(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRow;
