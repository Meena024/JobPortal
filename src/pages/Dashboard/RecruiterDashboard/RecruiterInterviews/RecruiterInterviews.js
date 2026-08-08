import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { rescheduleInterview } from "../../../../store/recruiterActions";
import InterviewRow from "./InterviewRow";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterInterviews.module.css";

const RecruiterInterviews = () => {
  const dispatch = useDispatch();

  const recruiterApplications = useSelector(
    (state) => state.recruiter.recruiterApplications || [],
  );

  const recruiterJobs = useSelector(
    (state) => state.recruiter.recruiterJobs || [],
  );

  const jobsMap = useMemo(() => {
    return recruiterJobs.reduce((map, job) => {
      map[job.id] = job;
      return map;
    }, {});
  }, [recruiterJobs]);

  /*
    INTERVIEWS FROM REDUX
  */

  const interviews = useMemo(() => {
    return recruiterApplications
      .filter((app) => app.interviewData?.interviewScheduled)
      .map((app) => ({
        ...app,
        recruitmentClosed: jobsMap[app.jobId]?.jobOpeningStatus === "closed",
      }))
      .sort((a, b) => {
        const dateA = new Date(
          `${a.interviewData.interviewDate} ${a.interviewData.interviewTime}`,
        );

        const dateB = new Date(
          `${b.interviewData.interviewDate} ${b.interviewData.interviewTime}`,
        );

        return dateB - dateA;
      });
  }, [recruiterApplications, jobsMap]);

  /*
    CHECK EXPIRED STATUS
  */

  const isExpired = (date, time) => {
    return new Date() - new Date(`${date} ${time}`) > 30 * 60 * 1000;
  };

  /*
    RESCHEDULE HANDLER
  */

  const rescheduleInterviewHandler = async (
    interview,
    newDate,
    newTime,
    reason,
  ) => {
    try {
      await dispatch(rescheduleInterview(interview, newDate, newTime, reason));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Scheduled Interviews</h1>

      {interviews.length === 0 && (
        <p className={styles.empty}>No interviews scheduled</p>
      )}

      {interviews.map((item) => (
        <InterviewRow
          key={item.id}
          interview={item}
          expired={isExpired(
            item.interviewData.interviewDate,
            item.interviewData.interviewTime,
          )}
          recruitmentClosed={item.recruitmentClosed}
          rescheduleInterview={rescheduleInterviewHandler}
        />
      ))}
    </div>
  );
};

export default RecruiterInterviews;
