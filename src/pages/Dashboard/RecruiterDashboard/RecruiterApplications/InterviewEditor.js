import styles from "./../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/InterviewScheduler.module.css";

const InterviewEditor = ({
  app,
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
        placeholder="Meeting link"
        value={form.interviewLink}
        onChange={(e) => changeHandler("interviewLink", e.target.value)}
      />

      <textarea
        placeholder="Instructions"
        value={form.interviewInstructions}
        onChange={(e) => changeHandler("interviewInstructions", e.target.value)}
      />

      <div className={styles.editorBtns}>
        <button className={styles.saveBtn} onClick={saveInterview}>
          Save
        </button>

        {app.interviewScheduled && (
          <button className={styles.cancelBtn} onClick={cancelEditing}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewEditor;
