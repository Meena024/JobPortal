import { useState } from "react";

import styles from "./RescheduleForm.module.css";

const RescheduleForm = ({ interview, onSave, onCancel }) => {
  const interviewData = interview.interviewData || {};

  const [date, setDate] = useState(interviewData.interviewDate || "");

  const [time, setTime] = useState(interviewData.interviewTime || "");

  const [reason, setReason] = useState("");

  const saveHandler = async () => {
    if (!date || !time) {
      window.alert("Please select a new interview date and time.");

      return;
    }

    await onSave(date, time, reason);

    setReason("");
  };

  return (
    <div className={styles.form}>
      <div className={styles.dateTimeRow}>
        <input
          type="date"
          className={`${styles.dateInput} input`}
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <input
          type="time"
          className={`${styles.timeInput} input`}
          value={time}
          onChange={(event) => setTime(event.target.value)}
        />
      </div>

      <textarea
        className={`${styles.reasonTextarea} textarea`}
        placeholder="Reason for reschedule"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />

      <div className={styles.buttons}>
        <button
          type="button"
          className="btn btn--primary"
          onClick={saveHandler}
        >
          Save
        </button>

        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RescheduleForm;
