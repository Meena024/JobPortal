import styles from "./ApplicationProcess.module.css";

const ApplicationProcess = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Application Process</h2>

      <div className={styles.process}>
        <span className={`${styles.stage} ${styles.pending}`}>Pending</span>

        <span className={styles.arrow}>→</span>

        <span className={`${styles.stage} ${styles.reviewed}`}>Reviewed</span>

        <span className={styles.arrow}>→</span>

        <span className={`${styles.stage} ${styles.shortlisted}`}>
          Shortlisted
        </span>

        <span className={styles.arrow}>→</span>

        <span className={`${styles.stage} ${styles.selected}`}>Selected</span>
      </div>

      <p className={styles.description}>
        Shortlisted candidates proceed to the interview stage.
      </p>
    </section>
  );
};

export default ApplicationProcess;
