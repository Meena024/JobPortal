import { useState } from "react";
import { useDispatch } from "react-redux";
import { MdEdit } from "react-icons/md";

import { saveOfferLetter } from "../../../../store/recruiterActions";

import styles from "./OfferLetterSection.module.css";

const OfferLetterSection = ({ app }) => {
  const dispatch = useDispatch();

  const offerLetter = app.offerLetter || {};

  const [editing, setEditing] = useState(!offerLetter.url);

  const [url, setUrl] = useState(offerLetter.url || "");

  /* =====================================================
     SAVE
  ===================================================== */

  const saveHandler = async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      window.alert("Please enter the offer letter URL.");

      return;
    }

    try {
      await dispatch(saveOfferLetter(app, trimmedUrl));

      setUrl(trimmedUrl);
      setEditing(false);
    } catch (error) {
      console.error("Unable to save offer letter:", error);
    }
  };

  /* =====================================================
     CANCEL EDITING
  ===================================================== */

  const cancelHandler = () => {
    setUrl(offerLetter.url || "");

    setEditing(false);
  };

  /* =====================================================
     OPEN OFFER LETTER
  ===================================================== */

  const viewOfferLetter = () => {
    if (!offerLetter.url) {
      return;
    }

    window.open(offerLetter.url, "_blank", "noopener,noreferrer");
  };

  /* =====================================================
     EDITOR
  ===================================================== */

  if (editing) {
    return (
      <section className={styles.editor}>
        <label htmlFor={`offer-letter-${app.id}`} className={styles.label}>
          Offer Letter URL
        </label>

        <input
          id={`offer-letter-${app.id}`}
          type="url"
          className="input"
          placeholder="Paste offer letter URL"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />

        <div className={styles.actions}>
          {offerLetter.url && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={cancelHandler}
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            className="btn btn--primary"
            onClick={saveHandler}
            disabled={!url.trim()}
          >
            Save
          </button>
        </div>
      </section>
    );
  }

  /* =====================================================
     PREVIEW
  ===================================================== */

  return (
    <section className={styles.preview}>
      <div>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => setEditing(true)}
          title="Click to edit"
        >
          <MdEdit />
        </button>
        <button
          type="button"
          className={styles.title}
          onClick={viewOfferLetter}
          title="Click to view"
        >
          Offer Letter
        </button>

        {offerLetter.uploadedAt && (
          <small className={styles.uploadedAt}>
            Uploaded on {new Date(offerLetter.uploadedAt).toLocaleDateString()}
          </small>
        )}
      </div>
    </section>
  );
};

export default OfferLetterSection;
