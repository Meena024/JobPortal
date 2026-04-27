import { useState, useRef } from "react";
import { useDispatch } from "react-redux";

import { dbApi } from "../../../../services/dbApi";
import { recruiterActions } from "../../../../store/recruiterSlice";

import InterviewScheduler from "./InterviewScheduler";
import styles from "./../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard.module.css";

const ApplicationCard = ({ app }) => {
  const dispatch = useDispatch();

  const notesTimers = useRef({});
  const [offerInputs, setOfferInputs] = useState({});

  /*
    STATUS CHANGE
  */

  const statusChangeHandler = async (status) => {
    await dbApi.patch(`applications/${app.id}`, {
      status,
    });

    dispatch(
      recruiterActions.updateApplicationStatus({
        id: app.id,
        status,
      }),
    );
  };

  /*
    NOTES SAVE (DEBOUNCED)
  */

  const notesChangeHandler = (notes) => {
    dispatch(
      recruiterActions.updateRecruiterNotes({
        id: app.id,
        notes,
      }),
    );

    if (notesTimers.current[app.id]) {
      clearTimeout(notesTimers.current[app.id]);
    }

    notesTimers.current[app.id] = setTimeout(async () => {
      await dbApi.patch(`applications/${app.id}`, {
        recruiterNotes: notes,
      });
    }, 600);
  };

  /*
    FINAL DECISION
  */

  const markSelected = async () => {
    await dbApi.patch(`applications/${app.id}`, {
      status: "selected",
    });

    dispatch(
      recruiterActions.updateApplicationStatus({
        id: app.id,
        status: "selected",
      }),
    );
  };

  const markRejected = async () => {
    await dbApi.patch(`applications/${app.id}`, {
      status: "rejected",
    });

    dispatch(
      recruiterActions.updateApplicationStatus({
        id: app.id,
        status: "rejected",
      }),
    );
  };

  /*
    OFFER LETTER SAVE
  */

  const saveOfferLetter = async () => {
    const offerLetterUrl = offerInputs[app.id];

    await dbApi.patch(`applications/${app.id}`, {
      offerLetterUrl,
    });

    dispatch(
      recruiterActions.updateOfferLetter({
        id: app.id,
        offerLetterUrl,
      }),
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.jobTitle}>{app.jobTitle}</h3>

        <select
          className={styles.statusSelect}
          value={app.status}
          onChange={(e) => statusChangeHandler(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <p className={styles.applicant}>
        <strong>Applicant:</strong> {app.applicantEmail}
      </p>

      <textarea
        className={styles.notes}
        placeholder="Recruiter notes..."
        value={app.recruiterNotes || ""}
        onChange={(e) => notesChangeHandler(e.target.value)}
      />

      <a
        href={app.resumeUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.link}
      >
        View Resume
      </a>

      {/* INTERVIEW */}

      {app.status === "shortlisted" && <InterviewScheduler app={app} />}

      {/* FINAL DECISION */}

      {app.interviewScheduled && (
        <div className={styles.actions}>
          <button className={styles.button} onClick={markSelected}>
            Selected
          </button>

          <button
            className={`${styles.button} ${styles.buttonDanger}`}
            onClick={markRejected}
          >
            Rejected
          </button>
        </div>
      )}

      {/* OFFER LETTER */}

      {app.status === "selected" && (
        <div className={styles.offerBox}>
          <input
            className={styles.offerInput}
            placeholder="Offer letter PDF link"
            onChange={(e) =>
              setOfferInputs((prev) => ({
                ...prev,
                [app.id]: e.target.value,
              }))
            }
          />

          <button className={styles.button} onClick={saveOfferLetter}>
            Save
          </button>
        </div>
      )}

      {app.offerLetterUrl && (
        <a
          href={app.offerLetterUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          View Offer Letter
        </a>
      )}
    </div>
  );
};

export default ApplicationCard;
