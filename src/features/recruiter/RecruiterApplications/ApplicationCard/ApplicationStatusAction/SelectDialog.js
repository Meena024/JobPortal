import styles from "./SelectDialog.module.css";

const SelectDialog = ({ open, onCancel, onConfirm }) => {
  if (!open) {
    return null;
  }

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
          Are you sure you want to select this candidate?
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn--success"
            onClick={onConfirm}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectDialog;
