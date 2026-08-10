import { useRef } from "react";
import { useDispatch } from "react-redux";

import { recruiterActions } from "../../../../../store/recruiterSlice";
import { updateRecruiterNotes } from "../../../../../store/recruiterActions";

import styles from "../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/RecruiterNotes.module.css";

const RecruiterNotes = ({ app, disabled }) => {
  const dispatch = useDispatch();

  const timer = useRef(null);

  const notesChangeHandler = (value) => {
    // Instant UI update
    dispatch(
      recruiterActions.updateRecruiterNotes({
        id: app.id,
        notes: value,
      }),
    );

    clearTimeout(timer.current);

    // Debounced database update
    timer.current = setTimeout(() => {
      dispatch(updateRecruiterNotes(app, value));
    }, 600);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Recruiter Notes</label>

      <textarea
        className={styles.notes}
        placeholder="Add private notes about this applicant..."
        value={app.recruiterNotes || ""}
        disabled={disabled}
        onChange={(e) => notesChangeHandler(e.target.value)}
      />
    </div>
  );
};

export default RecruiterNotes;
