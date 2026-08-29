import { useState } from "react";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeUtils";

import styles from "./RescheduleForm.module.css";

const RescheduleForm = ({ interview, onSave, onCancel }) => {
  const interviewData = interview.interviewData || {};

  const [date, setDate] = useState(interviewData.interviewDate || "");

  const [time, setTime] = useState(interviewData.interviewTime || "");

  const [reason, setReason] = useState("");

  const [saving, setSaving] = useState(false);

  const saveHandler = async () => {
    if (saving) {
      return;
    }

    if (!date || !time) {
      window.alert("Please select a new interview date and time.");

      return;
    }

    if (!reason.trim()) {
      window.alert("Please provide a reason for rescheduling.");

      return;
    }

    setSaving(true);

    try {
      await onSave(date, time, reason.trim());

      setReason("");
    } catch (error) {
      console.error("Reschedule error:", error);
    } finally {
      setSaving(false);
    }
  };

  const cancelHandler = () => {
    if (saving) {
      return;
    }

    onCancel();
  };

  return (
    <div className={styles.form}>
      <div className={styles.dateTimeRow}>
        <input
          type="date"
          className={`${styles.dateInput} input`}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          disabled={saving}
        />

        <input
          type="time"
          className={`${styles.timeInput} input`}
          value={time}
          onChange={(event) => setTime(event.target.value)}
          disabled={saving}
        />
      </div>

      <textarea
        className={`${styles.reasonTextarea} textarea`}
        placeholder="Reason for reschedule"
        value={reason}
        onChange={(event) =>
          setReason(capitalizeFirstLetter(event.target.value))
        }
        disabled={saving}
      />

      <div className={styles.buttons}>
        <button
          type="button"
          className="btn btn--primary"
          onClick={saveHandler}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={cancelHandler}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RescheduleForm;
