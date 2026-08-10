import styles from "../../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/OfferLetterSection.module.css";

const OfferLetterPreview = ({ offerLetter, onEdit }) => {
  return (
    <div className={styles.preview}>
      <div>
        <h4>Offer Letter</h4>

        <p className={styles.subtitle}>Offer letter has been uploaded.</p>

        {offerLetter?.uploadedAt && (
          <small>
            Uploaded on {new Date(offerLetter.uploadedAt).toLocaleString()}
          </small>
        )}
      </div>

      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.joinBtn}
          onClick={() =>
            window.open(offerLetter.url, "_blank", "noopener,noreferrer")
          }
        >
          View Offer Letter
        </button>

        <button type="button" className={styles.editBtn} onClick={onEdit}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default OfferLetterPreview;
