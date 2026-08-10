import styles from "../../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/InterviewScheduler.module.css";

const InterviewEditor = ({
  form,
  changeHandler,
  saveInterview,
  cancelEditing,
}) => {
  return (
    <div className={styles.editor}>
      <input
        type="date"
        value={form.interviewDate}
        onChange={(e) => changeHandler("interviewDate", e.target.value)}
      />

      <input
        type="time"
        value={form.interviewTime}
        onChange={(e) => changeHandler("interviewTime", e.target.value)}
      />

      <input
        type="url"
        placeholder="Meeting link"
        value={form.interviewLink}
        onChange={(e) => changeHandler("interviewLink", e.target.value)}
      />

      <textarea
        placeholder="Instructions for candidate..."
        value={form.interviewInstructions}
        onChange={(e) => changeHandler("interviewInstructions", e.target.value)}
      />

      <div className={styles.editorButtons}>
        <button
          type="button"
          className={styles.saveBtn}
          onClick={saveInterview}
        >
          Save Interview
        </button>

        <button
          type="button"
          className={styles.cancelBtn}
          onClick={cancelEditing}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default InterviewEditor;
