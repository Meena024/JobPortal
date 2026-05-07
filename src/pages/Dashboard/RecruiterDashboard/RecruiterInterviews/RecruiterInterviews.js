import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { dbApi } from "../../../../services/dbApi";
import { recruiterActions } from "../../../../store/recruiterSlice";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterInterviews.module.css";

import InterviewRow from "./InterviewRow";

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);

  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");

  /*
  FETCH INTERVIEWS
  */

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const jobs = await dbApi.get("jobs");
        const users = await dbApi.get("users");
        const applications = await dbApi.get("applications");

        if (!jobs || !applications) {
          setInterviews([]);
          return;
        }

        const recruiterJobs = Object.entries(jobs)
          .filter(([_, job]) => job.recruiterId === userId)
          .reduce((acc, [id, value]) => {
            acc[id] = value;
            return acc;
          }, {});

        const list = Object.entries(applications)
          .map(([id, app]) => {
            if (!app.interviewScheduled) return null;

            if (!recruiterJobs[app.jobId]) return null;

            return {
              id,
              ...app,
              jobTitle: recruiterJobs[app.jobId]?.title,
              applicantEmail: users?.[app.userId]?.profile?.email || "Unknown",
            };
          })
          .filter(Boolean)
          .sort(
            (a, b) =>
              new Date(`${b.interviewDate} ${b.interviewTime}`) -
              new Date(`${a.interviewDate} ${a.interviewTime}`),
          );

        setInterviews(list);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInterviews();
  }, [userId]);

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
      const currentInterview = interviews.find((i) => i.id === id);

      if (!currentInterview) return;

      /*
        CREATE HISTORY ENTRY
      */

      const newHistoryEntry = {
        previousDate: currentInterview.interviewDate,
        previousTime: currentInterview.interviewTime,
        reason,
        changedAt: new Date().toISOString(),
      };

      const updatedHistory = [
        ...(currentInterview.rescheduleHistory || []),
        newHistoryEntry,
      ];

      /*
        UPDATE BACKEND
      */

      await dbApi.patch(`applications/${id}`, {
        interviewDate: newDate,
        interviewTime: newTime,
        rescheduleHistory: updatedHistory,

        rescheduleRequested: false,
        rescheduleRequestReason: null,
        rescheduleRequestedAt: null,
      });

      /*
        ✅ UPDATE LOCAL STATE (IMPORTANT FIX)
      */

      setInterviews((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                interviewDate: newDate,
                interviewTime: newTime,
                rescheduleHistory: updatedHistory,
                rescheduleRequested: false,
                rescheduleRequestReason: null,
                rescheduleRequestedAt: null,
              }
            : item,
        ),
      );

      dispatch(
        recruiterActions.updateInterviewDetails({
          id,
          interviewData: {
            interviewDate: newDate,
            interviewTime: newTime,
            rescheduleHistory: updatedHistory,
            rescheduleRequested: false,
            rescheduleRequestReason: null,
            rescheduleRequestedAt: null,
          },
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
        const expired = isExpired(item.interviewDate, item.interviewTime);

        return (
          <InterviewRow
            key={item.id}
            interview={item}
            expired={expired}
            rescheduleInterview={rescheduleInterview}
          />
        );
      })}
    </div>
  );
};

export default RecruiterInterviews;
