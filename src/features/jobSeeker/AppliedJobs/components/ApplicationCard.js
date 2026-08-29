import ApplicationMeta from "./ApplicationMeta";
import UpcomingInterview from "./UpcomingInterview";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeUtils";

import styles from "../AppliedJobs.module.css";

const ApplicationCard = ({ app, highlightedRef, isHighlighted }) => {
  return (
    <article
      ref={highlightedRef}
      className={[
        styles.card,
        styles[app.status],
        app.jobOpeningStatus === "closed" ? styles.closed : "",
        isHighlighted ? styles.highlightCard : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className={styles.cardHeader}>
        <div className={styles.heading}>
          <h3 className={styles.jobTitle}>{app.jobTitle}</h3>

          <p className={styles.companyName}>{app.companyName}</p>
        </div>

        <div className={styles.status}>
          <span
            className={`${styles.statusBadge} ${
              styles[`status${capitalizeFirstLetter(app.status)}`] || ""
            }`}
          >
            {capitalizeFirstLetter(app.status)}
          </span>
        </div>
      </div>

      {/* =================================================
          META
      ================================================= */}

      <ApplicationMeta app={app} />

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <div>
        <span className={styles.metaLabel}>DESCRIPTION: </span>

        <span className={styles.description}>{app.description}</span>
      </div>

      {/* =================================================
          UPCOMING INTERVIEW
      ================================================= */}

      <UpcomingInterview app={app} />

      {/* =================================================
          OFFER LETTER
      ================================================= */}

      {app.status === "selected" && app.offerLetter?.url && (
        <button
          type="button"
          className={styles.offerLetter}
          onClick={() =>
            window.open(app.offerLetter.url, "_blank", "noopener,noreferrer")
          }
        >
          View Offer Letter
        </button>
      )}

      {/* =================================================
          JOB REMOVED
      ================================================= */}

      {!app.jobExists && (
        <span className={styles.removedBadge}>Job no longer available</span>
      )}

      {/* =================================================
          RECRUITMENT CLOSED
      ================================================= */}

      {app.jobOpeningStatus === "closed" && (
        <span className={styles.closedBadge}>Recruitment Closed</span>
      )}
    </article>
  );
};

export default ApplicationCard;
