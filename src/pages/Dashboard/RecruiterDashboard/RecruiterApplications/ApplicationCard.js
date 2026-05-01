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
  CREATE NOTIFICATION
  */

  const createNotification = async (message) => {
    try {
      await dbApi.post(`notifications/${app.userId}`, {
        message,
        applicationId: app.id,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  /*
  STATUS CHANGE
  */

  const statusChangeHandler = async (status) => {
    try {
      await dbApi.patch(`applications/${app.id}`, {
        status,
      });

      dispatch(
        recruiterActions.updateApplicationStatus({
          id: app.id,
          status,
        }),
      );

      await createNotification(
        `Your application for "${app.jobTitle}" is now ${status}.`,
      );
    } catch (err) {
      console.error(err);
    }
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

    try {
      await dbApi.patch(`applications/${app.id}`, {
        offerLetterUrl,
      });

      dispatch(
        recruiterActions.updateOfferLetter({
          id: app.id,
          offerLetterUrl,
        }),
      );

      await createNotification(`Offer letter uploaded for "${app.jobTitle}".`);

      setEditingOffer(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`${styles.card} ${styles[app.status]}`}>
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

      <div className={styles.meta}>Applicant: {app.applicantEmail}</div>

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

      {app.status === "shortlisted" && (
        <InterviewScheduler app={app} createNotification={createNotification} />
      )}

      {app.status === "selected" && (
        <>
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
