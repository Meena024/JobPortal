import { useState } from "react";
import { useDispatch } from "react-redux";

import { saveOfferLetter } from "../../../../../store/recruiterActions";

import styles from "../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/OfferLetterSection.module.css";

const OfferLetterSection = ({ app }) => {
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(!app.offerLetterUrl);

  const [offerUrl, setOfferUrl] = useState(app.offerLetterUrl || "");

  const saveHandler = async () => {
    if (!offerUrl.trim()) return;

    try {
      await dispatch(saveOfferLetter(app, offerUrl.trim()));
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (app.status !== "selected") {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>Offer Letter</h4>

      {!editing ? (
        <div className={styles.preview}>
          <a
            href={app.offerLetterUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            View Offer Letter
          </a>

          <button className={styles.editBtn} onClick={() => setEditing(true)}>
            Edit
          </button>
        </div>
      ) : (
        <div className={styles.editor}>
          <input
            type="text"
            placeholder="Offer Letter URL"
            value={offerUrl}
            onChange={(e) => setOfferUrl(e.target.value)}
          />

          <div className={styles.actions}>
            <button className={styles.saveBtn} onClick={saveHandler}>
              {app.offerLetterUrl ? "Update" : "Save"}
            </button>

            {app.offerLetterUrl && (
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setOfferUrl(app.offerLetterUrl);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferLetterSection;
