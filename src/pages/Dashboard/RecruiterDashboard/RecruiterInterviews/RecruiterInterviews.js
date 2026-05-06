import { useEffect, useState } from "react";

import { dbApi } from "../../../../services/dbApi";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterInterviews.module.css";

import InterviewRow from "./InterviewRow";

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);

  const userId = localStorage.getItem("userId");

  /*
  FETCH INTERVIEWS
  */

  useEffect(() => {
    const fetchInterviews = async () => {
      const jobs = await dbApi.get("jobs");
      const users = await dbApi.get("users");
      const applications = await dbApi.get("applications");

      if (!jobs || !applications) return;

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

  const rescheduleInterview = async (interviewId, newDate, newTime, reason) => {
    if (!newDate || !newTime || !reason) return;

    await dbApi.patch(`applications/${interviewId}`, {
      interviewDate: newDate,
      interviewTime: newTime,
      rescheduleReason: reason,
    });

    alert("Interview rescheduled successfully");

    window.location.reload();
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
