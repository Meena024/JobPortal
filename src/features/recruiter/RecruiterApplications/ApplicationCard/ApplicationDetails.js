import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { recruiterActions } from "../../../../store/recruiterSlice";
import { updateRecruiterNotes } from "../../../../store/recruiterActions";

import styles from "./ApplicationDetails.module.css";

const STATUS_LABELS = {
  pending: "Pending",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  selected: "Selected",
  rejected: "Rejected",
};

const SAVE_DELAY = 600;

const ApplicationDetails = ({
  app,
  recruitmentClosed = false,
  disabled = false,
  actions,
}) => {
  const dispatch = useDispatch();

  const timer = useRef(null);

  /* =====================================================
     CLEAN UP DEBOUNCE TIMER
  ===================================================== */

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  /* =====================================================
     STATUS
  ===================================================== */

  const statusLabel = STATUS_LABELS[app.status] || "Unknown";

  /* =====================================================
     NOTES
  ===================================================== */

  const notesChangeHandler = (value) => {
    /*
      Update Redux immediately so the UI stays responsive.
    */

    dispatch(
      recruiterActions.updateRecruiterNotes({
        id: app.id,
        notes: value,
      }),
    );

    /*
      Cancel the previous pending database save.
    */

    clearTimeout(timer.current);

    /*
      Save to the database only after the user
      stops typing for SAVE_DELAY milliseconds.
    */

    timer.current = setTimeout(() => {
      dispatch(updateRecruiterNotes(app, value));
    }, SAVE_DELAY);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className={styles.details}>
      {/* =================================================
          HEADER
      ================================================= */}

      <header className={styles.header}>
        <h3 className={styles.jobTitle}>{app.jobTitle}</h3>

        <div className={styles.headerRight}>
          <span className={`${styles.statusBadge} ${styles[app.status] || ""}`}>
            {statusLabel}
          </span>

          {recruitmentClosed && (
            <span className={styles.closedBadge}>Recruitment Closed</span>
          )}
        </div>
      </header>

      {/* =================================================
          APPLICANT INFORMATION
      ================================================= */}

      <div className={styles.applicantSection}>
        <div className={styles.info}>
          <span className={styles.label}>Applicant</span>

          <span className={styles.value}>
            {app.applicantEmail || "Unknown"}
          </span>
        </div>

        {app.resumeUrl && (
          <a
            href={app.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.resumeLink}
          >
            View Resume
          </a>
        )}
      </div>

      {/* =================================================
          NOTES + ACTIONS
      ================================================= */}

      <div className={styles.notesActionsRow}>
        <div className={styles.notesSection}>
          <label htmlFor={`notes-${app.id}`} className={styles.notesLabel}>
            Recruiter Notes
          </label>

          <textarea
            id={`notes-${app.id}`}
            className={`${styles.notes} textarea`}
            placeholder="Add private notes about this applicant..."
            value={app.recruiterNotes || ""}
            disabled={disabled}
            onChange={(event) => notesChangeHandler(event.target.value)}
          />
        </div>

        {!disabled && actions && (
          <div className={styles.actions}>{actions}</div>
        )}
      </div>
    </section>
  );
};

export default ApplicationDetails;
