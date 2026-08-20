import ApplicationDetails from "./ApplicationDetails";
import ApplicationStatusActions from "./ApplicationStatusAction/ApplicationStatusActions";

import InterviewScheduler from "./InterviewScheduler/InterviewScheduler";
import OfferLetterSection from "./OfferLetterSection";

import styles from "./ApplicationCard.module.css";

const ApplicationCard = ({ app, relatedJob }) => {
  const recruitmentClosed = relatedJob?.jobOpeningStatus === "closed";

  return (
    <article
      className={`${styles.card} ${
        recruitmentClosed ? styles.closedRecruitment : styles[app.status] || ""
      }`}
    >
      <ApplicationDetails
        app={app}
        recruitmentClosed={recruitmentClosed}
        disabled={recruitmentClosed}
        actions={
          <ApplicationStatusActions app={app} disabled={recruitmentClosed} />
        }
      />

      {!recruitmentClosed && app.status === "shortlisted" && (
        <InterviewScheduler app={app} />
      )}

      {!recruitmentClosed && app.status === "selected" && (
        <OfferLetterSection app={app} />
      )}

      {recruitmentClosed && (
        <div className={styles.closedMessage}>
          Recruitment has been closed for this job opening. Candidate processing
          has been locked.
        </div>
      )}
    </article>
  );
};

export default ApplicationCard;
