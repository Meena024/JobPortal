import { useState } from "react";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeUtils";

import styles from "./FeedbackPanel.module.css";

const FeedbackPanel = ({ mode, feedback = "", submittedAt, onSubmit }) => {
  const [value, setValue] = useState(feedback);

  const submitHandler = () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      window.alert("Please enter candidate performance.");
      return;
    }

    const confirmed = window.confirm(
      "Submit interview feedback?\n\nOnce submitted it cannot be edited.",
    );

    if (!confirmed) {
      return;
    }

    onSubmit(trimmedValue);
  };

  if (mode === "completed") {
    return (
      <div className={styles.completed}>
        <div className={styles.heading}>
          <h4>Candidate Performance</h4>
        </div>

        <div className={styles.completedBox}>
          <p className={styles.completedText}>
            {feedback || "No feedback recorded."}
          </p>

          {submittedAt && (
            <small className={styles.submittedAt}>
              Submitted {new Date(submittedAt).toLocaleString()}
            </small>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pending}>
      <div className={styles.heading}>
        <h4>Interview Feedback</h4>

        <button
          type="button"
          className={`btn btn--primary ${styles.submitButton}`}
          onClick={submitHandler}
        >
          Submit Feedback
        </button>
      </div>

      <textarea
        className={`${styles.feedbackTextarea} textarea`}
        placeholder="Enter candidate performance..."
        value={value}
        onChange={(event) =>
          setValue(capitalizeFirstLetter(event.target.value))
        }
      />
    </div>
  );
};

export default FeedbackPanel;
