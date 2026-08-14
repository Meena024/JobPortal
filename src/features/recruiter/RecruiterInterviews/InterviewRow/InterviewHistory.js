import styles from "./InterviewHistory.module.css";

const InterviewHistory = ({ history = [] }) => {
  const hasHistory = history.length > 0;

  return (
    <section className={styles.history}>
      <div className={styles.header}>
        <h4 className={styles.title}>History</h4>

        <span className={styles.count}>{history.length}</span>
      </div>

      {!hasHistory ? (
        <p className={styles.empty}>No reschedule history.</p>
      ) : (
        <div className={styles.list}>
          {history
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={`${item.changedAt || "history"}-${index}`}
                className={styles.item}
              >
                <p>
                  {item.previousDate} at {item.previousTime}
                </p>

                {item.reason && <span>{item.reason}</span>}

                {item.changedAt && (
                  <small>{new Date(item.changedAt).toLocaleString()}</small>
                )}
              </div>
            ))}
        </div>
      )}
    </section>
  );
};

export default InterviewHistory;
