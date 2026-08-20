import { useState } from "react";
import { useDispatch } from "react-redux";

import { rescheduleInterview } from "../../../../../store/recruiterActions";

import styles from "./RescheduleRequestCard.module.css";

const RescheduleRequestCard = ({ app }) => {
  const dispatch = useDispatch();

  const interviewData = app.interviewData || {};

  const request = interviewData.rescheduleRequest;

  const [date, setDate] = useState(interviewData.interviewDate || "");

  const [time, setTime] = useState(interviewData.interviewTime || "");

  if (!request?.rescheduleRequested) {
    return null;
  }

  const approveHandler = async () => {
    if (!date || !time) {
      window.alert("Please select a new interview date and time.");

      return;
    }

    try {
      await dispatch(
        rescheduleInterview(
          app,
          date,
          time,
          "Interview rescheduled after applicant request",
        ),
      );
    } catch (error) {
      console.error("Unable to approve reschedule request:", error);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>
          Candidate requested interview reschedule
        </h4>
      </div>

      <div className={styles.reason}>
        <span>Reason</span>

        <p>{request.rescheduleRequestReason || "No reason provided."}</p>
      </div>

      {request.rescheduleRequestedAt && (
        <p className={styles.requestedAt}>
          Requested on{" "}
          {new Date(request.rescheduleRequestedAt).toLocaleString()}
        </p>
      )}

      <div className={styles.dateTime}>
        <input
          type="date"
          className="input"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <input
          type="time"
          className="input"
          value={time}
          onChange={(event) => setTime(event.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className="btn btn--primary"
          onClick={approveHandler}
        >
          Approve & Reschedule
        </button>
      </div>
    </section>
  );
};

export default RescheduleRequestCard;
