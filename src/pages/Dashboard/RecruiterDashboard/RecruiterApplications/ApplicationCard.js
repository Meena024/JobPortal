import { useState, useRef } from "react";
import { useDispatch } from "react-redux";

import { dbApi } from "../../../../services/dbApi";
import { recruiterActions } from "../../../../store/recruiterSlice";

import InterviewScheduler from "./InterviewScheduler";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard.module.css";

const ApplicationCard = ({ app }) => {
  const dispatch = useDispatch();

  const notesTimers = useRef({});
  const [offerInputs, setOfferInputs] = useState({});
  const [editingOffer, setEditingOffer] = useState(false);

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

    clearTimeout(notesTimers.current[app.id]);

    notesTimers.current[app.id] = setTimeout(async () => {
      await dbApi.patch(`applications/${app.id}`, {
        recruiterNotes: notes,
      });
    }, 600);
  };

  /*
    OFFER LETTER SAVE / UPDATE
  */

  const saveOfferLetter = async () => {
    const offerLetterUrl = offerInputs[app.id];

    if (!offerLetterUrl) return;

    await dbApi.patch(`applications/${app.id}`, {
      offerLetterUrl,
    });

    dispatch(
      recruiterActions.updateOfferLetter({
        id: app.id,
        offerLetterUrl,
      }),
    );

    setEditingOffer(false);
  };

  return (
    <div className={`${styles.card} ${styles[app.status]}`}>
      {/* HEADER */}

      <div className={styles.header}>
        <h3>{app.jobTitle}</h3>

        <select
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

      {/* APPLICANT */}

      <div className={styles.meta}>Applicant: {app.applicantEmail}</div>

      {/* NOTES */}

      <textarea
        className={styles.notes}
        placeholder="Recruiter notes..."
        value={app.recruiterNotes || ""}
        onChange={(e) => notesChangeHandler(e.target.value)}
      />

      {/* RESUME LINK */}

      <a
        href={app.resumeUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.link}
      >
        View Resume
      </a>

      {/* INTERVIEW BLOCK */}

      {app.status === "shortlisted" && <InterviewScheduler app={app} />}

      {/* OFFER LETTER SECTION */}

      {app.status === "selected" && (
        <>
          {/* VIEW MODE */}

          {app.offerLetterUrl && !editingOffer && (
            <div className={styles.offerView}>
              <a
                href={app.offerLetterUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                View Offer Letter
              </a>

              <button
                className={styles.editOfferBtn}
                onClick={() => setEditingOffer(true)}
              >
                Edit
              </button>
            </div>
          )}

          {/* EDIT MODE */}

          {(!app.offerLetterUrl || editingOffer) && (
            <div className={styles.offerBox}>
              <input
                defaultValue={app.offerLetterUrl || ""}
                placeholder="Offer letter URL"
                onChange={(e) =>
                  setOfferInputs((prev) => ({
                    ...prev,
                    [app.id]: e.target.value,
                  }))
                }
              />

              <button onClick={saveOfferLetter}>
                {app.offerLetterUrl ? "Update" : "Save"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationCard;
