import InterviewDetails from "./InterviewDetails";
import InterviewHistory from "./InterviewHistory";
import InterviewActions from "./InterviewActions";

import styles from "./InterviewRow.module.css";

const InterviewRow = ({ interview, recruitmentClosed, onReschedule }) => {
  const interviewData = interview.interviewData || {};

  const interviewCompleted = interviewData.interviewStatus === "completed";

  const interviewDate = interviewData.interviewDate || "";

  const interviewTime = interviewData.interviewTime || "";

  const interviewDateTime =
    interviewDate && interviewTime
      ? new Date(`${interviewDate}T${interviewTime}`)
      : null;

  const expired =
    interviewDateTime && !Number.isNaN(interviewDateTime.getTime())
      ? Date.now() >= interviewDateTime.getTime()
      : false;

  return (
    <article
      className={`${styles.card} ${recruitmentClosed ? styles.cardClosed : ""}`}
    >
      <InterviewDetails
        interview={interview}
        interviewData={interviewData}
        interviewCompleted={interviewCompleted}
        expired={expired}
      />

      <InterviewHistory history={interviewData.rescheduleHistory || []} />

      <InterviewActions
        interview={interview}
        interviewData={interviewData}
        interviewCompleted={interviewCompleted}
        expired={expired}
        recruitmentClosed={recruitmentClosed}
        onReschedule={onReschedule}
      />
    </article>
  );
};

export default InterviewRow;
