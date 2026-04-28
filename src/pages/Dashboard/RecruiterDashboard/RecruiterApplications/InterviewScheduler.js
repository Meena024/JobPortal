import { useState } from "react";
import { useDispatch } from "react-redux";

import { dbApi } from "../../../../services/dbApi";
import { recruiterActions } from "../../../../store/recruiterSlice";

import styles from "./../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/InterviewScheduler.module.css";

const InterviewScheduler = ({ app }) => {
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(!app.interviewScheduled);

  const [form, setForm] = useState({
    interviewDate: app.interviewDate || "",
    interviewTime: app.interviewTime || "",
    interviewLink: app.interviewLink || "",
    interviewInstructions: app.interviewInstructions || "",
  });

  const changeHandler = (field, value) =>
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  const saveInterview = async () => {
    const interviewData = {
      interviewScheduled: true,
      ...form,
    };

    await dbApi.patch(`applications/${app.id}`, interviewData);

    dispatch(
      recruiterActions.updateInterviewDetails({
        id: app.id,
        interviewData,
      }),
    );

    setEditing(false);
  };

  if (!editing)
    return (
      <div className={styles.preview}>
        <div className={styles.left}>
          <strong className={styles.title}>Interview Scheduled</strong>

          <div className={styles.meta}>{app.interviewDate}</div>

          <div className={styles.meta}>{app.interviewTime}</div>

          <button className={styles.editBtn} onClick={() => setEditing(true)}>
            Edit
          </button>
        </div>

        <div className={styles.right}>
          <a
            href={app.interviewLink}
            target="_blank"
            rel="noreferrer"
            className={styles.join}
          >
            Join Meeting
          </a>

          <div className={styles.instructions}>{app.interviewInstructions}</div>
        </div>
      </div>
    );

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

      <button onClick={saveInterview}>Save Interview</button>
    </div>
  );
};

export default InterviewScheduler;
