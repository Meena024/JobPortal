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

  const changeHandler = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveInterview = async () => {
    const {
      interviewDate,
      interviewTime,
      interviewLink,
      interviewInstructions,
    } = form;

    if (
      !interviewDate ||
      !interviewTime ||
      !interviewLink ||
      !interviewInstructions
    ) {
      alert("Please complete all interview details 📅");
      return;
    }

    const interviewData = {
      interviewScheduled: true,
      interviewDate,
      interviewTime,
      interviewLink,
      interviewInstructions,
    };

    try {
      await dbApi.patch(`applications/${app.id}`, interviewData);

      dispatch(
        recruiterActions.updateInterviewDetails({
          id: app.id,
          interviewData,
        }),
      );

      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save interview details ❌");
    }
  };

  if (!editing) {
    return (
      <div className={styles.wrapper}>
        <strong className={styles.previewTitle}>Interview Scheduled ✅</strong>

        <p className={styles.info}>
          <b>Date:</b> {app.interviewDate}
          <br />
          <b>Time:</b> {app.interviewTime}
        </p>

        <p className={styles.instructions}>{app.interviewInstructions}</p>

        <p>
          <a
            href={app.interviewLink}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Join Meeting 🔗
          </a>
        </p>

        <button
          className={`${styles.button} ${styles.editBtn}`}
          onClick={() => setEditing(true)}
        >
          Edit Interview
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="date"
          value={form.interviewDate}
          onChange={(e) => changeHandler("interviewDate", e.target.value)}
        />

        <input
          className={styles.input}
          type="time"
          value={form.interviewTime}
          onChange={(e) => changeHandler("interviewTime", e.target.value)}
        />
      </div>

      <input
        className={styles.input}
        placeholder="Meeting link"
        value={form.interviewLink}
        onChange={(e) => changeHandler("interviewLink", e.target.value)}
      />

      <textarea
        className={styles.textarea}
        placeholder="Interview instructions"
        value={form.interviewInstructions}
        onChange={(e) => changeHandler("interviewInstructions", e.target.value)}
      />

      <button className={styles.button} onClick={saveInterview}>
        {app.interviewScheduled ? "Update Interview" : "Schedule Interview"}
      </button>
    </div>
  );
};

export default InterviewScheduler;
