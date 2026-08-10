import styles from "../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/StatusTimeline.module.css";

const StatusTimeline = ({ app }) => {
  const interviewScheduled = app.interviewData?.interviewScheduled;

  const interviewCancelled =
    app.status === "shortlisted" && !interviewScheduled;

  const steps = [
    {
      key: "pending",
      label: "Applied",
      completed: true,
    },
    {
      key: "reviewed",
      label: "Reviewed",
      completed: ["reviewed", "shortlisted", "selected", "rejected"].includes(
        app.status,
      ),
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
      completed: ["shortlisted", "selected"].includes(app.status),
    },
    {
      key: "interview",
      label: "Interview",
      completed: interviewScheduled,
      warning: interviewCancelled,
    },
    {
      key: "selected",
      label: app.status === "rejected" ? "Rejected" : "Selected",
      completed: ["selected", "rejected"].includes(app.status),
      rejected: app.status === "rejected",
    },
  ];

  return (
    <div className={styles.timeline}>
      {steps.map((step, index) => (
        <div key={step.key} className={styles.step}>
          <div
            className={`
              ${styles.circle}
              ${step.completed ? styles.completed : ""}
              ${step.warning ? styles.warning : ""}
              ${step.rejected ? styles.rejected : ""}
            `}
          >
            {step.completed ? "✓" : index + 1}
          </div>

          <div className={styles.label}>{step.label}</div>

          {index !== steps.length - 1 && (
            <div
              className={`
                ${styles.line}
                ${step.completed ? styles.lineCompleted : ""}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;
