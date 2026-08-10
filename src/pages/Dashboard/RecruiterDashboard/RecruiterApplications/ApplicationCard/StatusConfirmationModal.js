import styles from "../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/StatusConfirmationModal.module.css";

const StatusConfirmationModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  children,
  onConfirm,
  onCancel,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>{title}</h3>

        <p>{message}</p>

        {children}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>

          <button
            className={`${styles.confirmBtn} ${
              confirmVariant === "danger" ? styles.danger : styles.primary
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusConfirmationModal;
