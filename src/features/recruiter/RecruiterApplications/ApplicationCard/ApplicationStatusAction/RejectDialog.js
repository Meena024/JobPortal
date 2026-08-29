import { useState } from "react";
import { capitalizeFirstLetter } from "../../../../../utils/capitalizeUtils";

import styles from "./RejectDialog.module.css";

const RejectDialog = ({ open, onCancel, onConfirm }) => {
  const [reason, setReason] = useState("");

  if (!open) {
    return null;
  }

  /* =====================================================
     CONFIRM
  ===================================================== */

  const confirmHandler = () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      window.alert("Please provide a reason before rejecting this candidate.");

      return;
    }

    onConfirm(trimmedReason);

    setReason("");
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const cancelHandler = () => {
    setReason("");

    onCancel();
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-candidate-title"
    >
      <div className={styles.dialog}>
        <h3 id="reject-candidate-title">Reject Candidate?</h3>

        <p className={styles.message}>
          This application will be marked as <strong>Rejected</strong>.
        </p>

        <textarea
          className="textarea"
          placeholder="Enter the reason for rejection..."
          value={reason}
          onChange={(event) =>
            setReason(capitalizeFirstLetter(event.target.value))
          }
          autoFocus
        />

        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={cancelHandler}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn--danger"
            onClick={confirmHandler}
          >
            Reject Candidate
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectDialog;
