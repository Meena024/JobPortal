import { useState } from "react";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterInterviews.module.css";

const InterviewRow = ({ interview, expired, rescheduleInterview }) => {
  const [editMode, setEditMode] = useState(false);

  const [date, setDate] = useState(interview.interviewDate);

  const [time, setTime] = useState(interview.interviewTime);

  const [reason, setReason] = useState("");

  return (
    <div className={`${styles.row} ${expired ? styles.expired : ""}`}>
      <div className={styles.info}>
        <div>
          <strong>Job:</strong> {interview.jobTitle}
        </div>

        <div>
          <strong>Applicant:</strong> {interview.applicantEmail}
        </div>

        <div>
          <strong>Date:</strong> {interview.interviewDate}
        </div>

        <div>
          <strong>Time:</strong> {interview.interviewTime}
        </div>

        {interview.recruiterNotes && (
          <div>
            <strong>Notes:</strong> {interview.recruiterNotes}
          </div>
        )}

        <div>
          <strong>Instructions:</strong> {interview.interviewInstructions}
        </div>

        {interview.rescheduleRequested && (
          <div className={styles.requestBox}>
            <strong>Reschedule Request:</strong>

            <div className={styles.requestReason}>
              {interview.rescheduleRequestReason}
            </div>

            {interview.rescheduleRequestedAt && (
              <div className={styles.requestTime}>
                Requested at:{" "}
                {new Date(interview.rescheduleRequestedAt).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {interview.rescheduleHistory?.length > 0 && (
          <div className={styles.history}>
            <strong>History:</strong>

            {interview.rescheduleHistory
              .slice()
              .reverse()
              .map((item, index) => (
                <div key={index} className={styles.historyItem}>
                  <div>
                    <span>
                      Previous Schedule: {item.previousDate} at{" "}
                      {item.previousTime}
                    </span>
                  </div>

                  <div className={styles.reason}>{item.reason}</div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {!expired ? (
          <a
            href={interview.interviewLink}
            target="_blank"
            rel="noreferrer"
            className={styles.joinBtn}
          >
            Join Meeting
          </a>
        ) : (
          <span className={styles.disabled}>Meeting expired</span>
        )}

        {interview.rescheduleRequested && !editMode && (
          <button
            className={styles.acceptBtn}
            onClick={() => setEditMode(true)}
          >
            Respond to Request
          </button>
        )}

        {!editMode && !interview.rescheduleRequested && (
          <button className={styles.joinBtn} onClick={() => setEditMode(true)}>
            Reschedule
          </button>
        )}

        {editMode && (
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

            <button
              onClick={() => {
                rescheduleInterview(interview.id, date, time, reason);
                setReason("");
                setEditMode(false);
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRow;
