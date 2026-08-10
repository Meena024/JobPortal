import styles from "../../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/InterviewScheduler.module.css";

const InterviewHistory = ({ app }) => {
  const history = app.interviewData?.rescheduleHistory || {};

  const historyItems = Object.entries(history)
    .map(([id, item]) => ({
      id,
      ...item,
    }))
    .sort(
      (a, b) =>
        new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
    );

  if (historyItems.length === 0) return null;

  return (
    <div className={styles.historyCard}>
      <h4 className={styles.historyTitle}>Interview History</h4>

      <div className={styles.historyList}>
        {historyItems.map((item) => (
          <div key={item.id} className={styles.historyItem}>
            <div className={styles.historyDate}>
              {new Date(item.changedAt).toLocaleString()}
            </div>

            <div className={styles.historyContent}>
              <div>
                <strong>Previous Schedule:</strong> {item.previousDate} at{" "}
                {item.previousTime}
              </div>

              <div>
                <strong>Reason:</strong> {item.reason}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewHistory;
