import styles from "../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/ConfirmStatusModal.module.css";

const ConfirmStatusModal = ({
  open,
  title,
  message,
  showReason = false,
  reason,
  setReason,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmClass = "",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{title}</h3>

        <p>{message}</p>

        {showReason && (
          <textarea
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>

          <button
            className={`${styles.confirmBtn} ${confirmClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStatusModal;
