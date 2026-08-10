import { useState } from "react";

import styles from "../../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/SelectDialog.module.css";

const SelectDialog = ({ open, onCancel, onConfirm }) => {
  const [sendOfferNow, setSendOfferNow] = useState(true);

  if (!open) return null;

  const confirmHandler = () => {
    onConfirm({
      sendOfferNow,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h3>Select Candidate</h3>

        <p className={styles.message}>
          The candidate will be marked as <strong>Selected</strong>.
        </p>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={sendOfferNow}
            onChange={(e) => setSendOfferNow(e.target.checked)}
          />
          Open Offer Letter section immediately
        </label>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>

          <button className={styles.confirmBtn} onClick={confirmHandler}>
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectDialog;
