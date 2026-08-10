import { useState } from "react";

import styles from "../../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/OfferLetterSection.module.css";

const OfferLetterEditor = ({ initialValue, onSave, onCancel }) => {
  const [url, setUrl] = useState(initialValue || "");

  return (
    <div className={styles.editor}>
      <label className={styles.label}>Offer Letter URL</label>

      <input
        type="url"
        placeholder="Paste offer letter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className={styles.actions}>
        <button className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>

        <button
          className={styles.saveBtn}
          onClick={() => onSave(url)}
          disabled={!url.trim()}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default OfferLetterEditor;
