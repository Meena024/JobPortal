import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/JobSeekerDashboard/MyInterviews.module.css";

const MyInterviews = () => {
  const [requestInputs, setRequestInputs] = useState({});

  const appliedJobs = useSelector((s) => s.jobs.appliedJobs);

  /*
    INTERVIEWS
  */
  const interviews = useMemo(() => {
    return (appliedJobs || [])
      .filter(
        (app) => app.interviewData && app.interviewData.interviewScheduled,
      )
      .sort((a, b) => {
        const dateA = new Date(
          `${a.interviewData.interviewDate} ${a.interviewData.interviewTime}`,
        );

        const dateB = new Date(
          `${b.interviewData.interviewDate} ${b.interviewData.interviewTime}`,
        );

        return dateB - dateA;
      });
  }, [appliedJobs]);

  /*
    EXPIRED CHECK
  */
  const isExpired = (date, time) => {
    const interviewTime = new Date(`${date} ${time}`);
    return new Date() > interviewTime;
  };

  /*
    REQUEST RESCHEDULE
  */
  const requestReschedule = async (item) => {
    const reason = requestInputs[item.id];

    if (!reason?.trim()) {
      alert("Please enter a reason");
      return;
    }

    try {
      await dbApi.patch(
        `applications/${item.recruiterId}/${item.id}/interviewData/`,
        {
          rescheduleRequested: true,
          rescheduleRequestReason: reason,
          rescheduleRequestedAt: new Date().toISOString(),
        },
      );

      alert("Reschedule request sent");

      setRequestInputs((prev) => ({
        ...prev,
        [item.id]: "",
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  return (
    <div className={classes.wrapper}>
      <h1 className={classes.title}>My Interviews</h1>

      {interviews.length === 0 && (
        <p className={classes.empty}>No interviews scheduled</p>
      )}

      {interviews.map((item) => {
        const interview = item.interviewData;

        const expired = isExpired(
          interview.interviewDate,
          interview.interviewTime,
        );

        return (
          <div
            key={item.id}
            className={`${classes.row} ${expired ? classes.expired : ""}`}
          >
            <div className={classes.col1}>
              <div>
                <strong>Job:</strong> {item.jobTitle}
              </div>

              <div>
                <strong>Recruiter:</strong> {item.recruiterEmail}
              </div>

              <div>
                <strong>Date:</strong> {interview.interviewDate}
              </div>

              <div>
                <strong>Time:</strong> {interview.interviewTime}
              </div>

              {interview.interviewInstructions && (
                <div>
                  <strong>Instructions:</strong>{" "}
                  {interview.interviewInstructions}
                </div>
              )}

              {item.rescheduleRequested && (
                <div className={classes.requestBox}>
                  <strong>Reschedule Request:</strong>

                  <div className={classes.requestReason}>
                    {item.rescheduleRequestReason}
                  </div>

                  {item.rescheduleRequestedAt && (
                    <div className={classes.requestTime}>
                      Requested at:{" "}
                      {new Date(item.rescheduleRequestedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={classes.col2}>
              {item.rescheduleHistory?.length > 0 && (
                <div>
                  <strong>History:</strong>

                  <div className={classes.history}>
                    {[...item.rescheduleHistory]
                      .reverse()
                      .map((history, index) => (
                        <div key={index} className={classes.historyItem}>
                          <div>Previous Date: {history.previousDate}</div>

                          <div>Previous Time: {history.previousTime}</div>

                          <div className={classes.reason}>{history.reason}</div>

                          {history.changedAt && (
                            <div className={classes.requestTime}>
                              {new Date(history.changedAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className={classes.col3}>
              {!expired ? (
                <a
                  href={interview.interviewLink}
                  target="_blank"
                  rel="noreferrer"
                  className={classes.joinBtn}
                >
                  Join Meeting
                </a>
              ) : (
                <span className={classes.disabled}>Interview Completed</span>
              )}

              {!expired && !item.rescheduleRequested && (
                <div className={classes.rescheduleBox}>
                  <textarea
                    placeholder="Reason for reschedule"
                    value={requestInputs[item.id] || ""}
                    onChange={(e) =>
                      setRequestInputs((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                  />

                  <button
                    className={classes.rescheduleBtn}
                    onClick={() => requestReschedule(item)}
                  >
                    Request Reschedule
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyInterviews;
