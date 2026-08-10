import { useState } from "react";
import { useDispatch } from "react-redux";

import { rescheduleInterview } from "../../../../../../store/recruiterActions";

import styles from "../../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/InterviewScheduler.module.css";

const RescheduleRequestCard = ({ app }) => {
  const dispatch = useDispatch();

  const request = app.interviewData?.rescheduleRequest;

  const [date, setDate] = useState(app.interviewData?.interviewDate || "");

  const [time, setTime] = useState(app.interviewData?.interviewTime || "");

  if (!request?.rescheduleRequested) return null;

  const approveHandler = async () => {
    try {
      await dispatch(
        rescheduleInterview(
          app,
          date,
          time,
          "Interview rescheduled after applicant request",
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.requestCard}>
      <div className={styles.requestHeader}>
        Candidate requested interview reschedule
      </div>

      <div className={styles.requestReason}>
        <strong>Reason</strong>

        <p>{request.rescheduleRequestReason || "No reason provided."}</p>
      </div>

      <div className={styles.requestMeta}>
        Requested on {new Date(request.rescheduleRequestedAt).toLocaleString()}
      </div>

      <div className={styles.requestEditor}>
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
      </div>

      <div className={styles.requestActions}>
        <button className={styles.approveBtn} onClick={approveHandler}>
          Approve & Reschedule
        </button>
      </div>
    </div>
  );
};

export default RescheduleRequestCard;
