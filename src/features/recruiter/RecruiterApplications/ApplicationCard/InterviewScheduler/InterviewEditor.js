import { useState } from "react";
import { capitalizeFirstLetter } from "../../../../../utils/capitalizeUtils";

import styles from "./InterviewEditor.module.css";

const InterviewEditor = ({
  form,
  changeHandler,
  saveInterview,
  cancelEditing,
}) => {
  const hasExistingInterview = Boolean(
    form.interviewDate ||
    form.interviewTime ||
    form.interviewLink ||
    form.interviewInstructions,
  );

  const [showForm, setShowForm] = useState(hasExistingInterview);

  /* =====================================================
     OPEN
  ===================================================== */

  const openForm = () => {
    setShowForm(true);
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const cancelHandler = () => {
    setShowForm(false);

    cancelEditing();
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const saveHandler = async () => {
    await saveInterview();

    setShowForm(false);
  };

  /* =====================================================
     TOGGLE BUTTON
  ===================================================== */

  if (!showForm) {
    return (
      <button type="button" className="btn btn--primary" onClick={openForm}>
        Schedule Interview
      </button>
    );
  }

  /* =====================================================
     EDITOR
  ===================================================== */

  return (
    <section className={styles.editor}>
      {/* =================================================
          DATE / TIME / LINK
      ================================================= */}

      <div className={styles.topRow}>
        <input
          type="date"
          className="input"
          value={form.interviewDate}
          onChange={(event) =>
            changeHandler("interviewDate", event.target.value)
          }
          aria-label="Interview date"
        />

        <input
          type="time"
          className="input"
          value={form.interviewTime}
          onChange={(event) =>
            changeHandler("interviewTime", event.target.value)
          }
          aria-label="Interview time"
        />

        <input
          type="url"
          className="input"
          placeholder="Meeting link"
          value={form.interviewLink}
          onChange={(event) =>
            changeHandler("interviewLink", event.target.value)
          }
        />
      </div>

      {/* =================================================
          INSTRUCTIONS + ACTIONS
      ================================================= */}

      <div className={styles.bottomRow}>
        <textarea
          className="textarea"
          placeholder="Instructions for candidate..."
          value={form.interviewInstructions}
          onChange={(event) =>
            changeHandler(
              "interviewInstructions",
              capitalizeFirstLetter(event.target.value),
            )
          }
        />

        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn--primary"
            onClick={saveHandler}
          >
            Schedule
          </button>

          <button
            type="button"
            className="btn btn--secondary"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default InterviewEditor;
