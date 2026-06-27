import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { dbApi } from "../../../../services/dbApi";
import { recruiterActions } from "../../../../store/recruiterSlice";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterInterviews.module.css";

import InterviewRow from "./InterviewRow";

const RecruiterInterviews = () => {
  const dispatch = useDispatch();

  const recruiterApplications = useSelector(
    (state) => state.recruiter.recruiterApplications,
  );

  const recruiterJobs = useSelector((state) => state.recruiter.recruiterJobs);

  const jobsMap = useMemo(() => {
    const map = {};

    (recruiterJobs || []).forEach((job) => {
      map[job.id] = job;
    });

    return map;
  }, [recruiterJobs]);

  /*
    INTERVIEWS FROM REDUX
  */

  const interviews = useMemo(() => {
    return (recruiterApplications || [])
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
    const interviewTime = new Date(`${date} ${time}`);
    const now = new Date();

    return now - interviewTime > 30 * 60 * 1000;
  };

  /*
    RESCHEDULE HANDLER
  */

  const rescheduleInterview = async (id, newDate, newTime, reason) => {
    try {
      const currentInterview = interviews.find((item) => item.id === id);

      if (!currentInterview) return;

      const interviewData = currentInterview.interviewData || {};

      const newHistoryEntry = {
        previousDate: interviewData.interviewDate,
        previousTime: interviewData.interviewTime,
        reason,
        changedAt: new Date().toISOString(),
      };

      const updatedHistory = [
        ...(currentInterview.rescheduleHistory || []),
        newHistoryEntry,
      ];

      await dbApi.patch(`applications/${currentInterview.recruiterId}/${id}`, {
        interviewData: {
          ...interviewData,
          interviewDate: newDate,
          interviewTime: newTime,
        },

        rescheduleHistory: updatedHistory,

        rescheduleRequested: false,
        rescheduleRequestReason: "",
        rescheduleRequestedAt: "",
      });

      dispatch(
        recruiterActions.updateInterviewDetails({
          id,

          interviewData: {
            ...interviewData,
            interviewDate: newDate,
            interviewTime: newTime,
          },

          rescheduleHistory: updatedHistory,

          rescheduleRequested: false,
          rescheduleRequestReason: "",
          rescheduleRequestedAt: "",
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Scheduled Interviews</h1>

      {interviews.length === 0 && (
        <p className={styles.empty}>No interviews scheduled</p>
      )}

      {interviews.map((item) => {
        const expired = isExpired(
          item.interviewData.interviewDate,
          item.interviewData.interviewTime,
        );

        return (
          <InterviewRow
            key={item.id}
            interview={item}
            expired={expired}
            recruitmentClosed={item.recruitmentClosed}
            rescheduleInterview={rescheduleInterview}
          />
        );
      })}
    </div>
  );
};

export default RecruiterInterviews;
