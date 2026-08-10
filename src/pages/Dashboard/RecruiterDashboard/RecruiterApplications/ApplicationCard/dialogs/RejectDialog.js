import { useState } from "react";

import styles from "../../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/RejectDialog.module.css";

const RejectDialog = ({ open, onCancel, onConfirm }) => {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const confirmHandler = () => {
    onConfirm(reason);
    setReason("");
  };

  const cancelHandler = () => {
    setReason("");
    onCancel();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h3>Reject Candidate?</h3>

        <p className={styles.message}>
          This application will be marked as <strong>Rejected</strong>.
        </p>

        <textarea
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={cancelHandler}>
            Cancel
          </button>

          <button className={styles.rejectBtn} onClick={confirmHandler}>
            Reject Candidate
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectDialog;
