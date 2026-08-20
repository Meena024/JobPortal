import { useState } from "react";

import styles from "./SelectDialog.module.css";

const SelectDialog = ({ open, onCancel, onConfirm }) => {
  const [sendOfferNow, setSendOfferNow] = useState(true);

  if (!open) {
    return null;
  }

  /* =====================================================
     CONFIRM
  ===================================================== */

  const confirmHandler = () => {
    onConfirm({
      sendOfferNow,
    });
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const cancelHandler = () => {
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
      aria-labelledby="select-candidate-title"
    >
      <div className={styles.dialog}>
        <h3 id="select-candidate-title">Select Candidate</h3>

        <p className={styles.message}>
          The candidate will be marked as <strong>Selected</strong>.
        </p>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={sendOfferNow}
            onChange={(event) => setSendOfferNow(event.target.checked)}
          />

          <span>Open Offer Letter section immediately</span>
        </label>

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
            className="btn btn--success"
            onClick={confirmHandler}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectDialog;
