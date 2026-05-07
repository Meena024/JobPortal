import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/JobSeekerDashboard/MyInterviews.module.css";

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [requestInputs, setRequestInputs] = useState({});

  const userId = localStorage.getItem("userId");

  /*
    FETCH INTERVIEWS
  */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const applications = await dbApi.get("applications");
        const jobs = await dbApi.get("jobs");

        if (!applications) return;

        const list = Object.entries(applications)
          .map(([id, app]) => {
            if (app.userId !== userId) return null;
            if (!app.interviewScheduled) return null;

            return {
              id,
              ...app,
              jobTitle: jobs?.[app.jobId]?.title || "Job removed",
              companyName: jobs?.[app.jobId]?.companyName || "Unknown",
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

    fetchData();
  }, [userId]);

  /*
    EXPIRED CHECK
  */
  const isExpired = (date, time) => {
    const interviewTime = new Date(`${date} ${time}`);
    const now = new Date();

    return now > interviewTime;
  };

  /*
    REQUEST RESCHEDULE
  */
  const requestReschedule = async (id) => {
    const reason = requestInputs[id];

    if (!reason) return;

    try {
      await dbApi.patch(`applications/${id}`, {
        rescheduleRequested: true,
        rescheduleRequestReason: reason,
      });

      alert("Reschedule request sent");

      setRequestInputs((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={classes.wrapper}>
      <h1 className={classes.title}>My Interviews</h1>

      {interviews.length === 0 && (
        <p className={classes.empty}>No interviews scheduled</p>
      )}

      {interviews.map((item) => {
        const expired = isExpired(item.interviewDate, item.interviewTime);

        return (
          <div
            key={item.id}
            className={`${classes.row} ${expired ? classes.expired : ""}`}
          >
            <div className={classes.info}>
              <div>
                <strong>Job:</strong> {item.jobTitle}
              </div>

              <div>
                <strong>Company:</strong> {item.companyName}
              </div>

              <div>
                <strong>Date:</strong> {item.interviewDate}
              </div>

              <div>
                <strong>Time:</strong> {item.interviewTime}
              </div>

              {item.interviewInstructions && (
                <div>
                  <strong>Instructions:</strong> {item.interviewInstructions}
                </div>
              )}

              {/* HISTORY */}
              {item.rescheduleHistory?.length > 0 && (
                <div className={classes.history}>
                  <strong>History:</strong>

                  {item.rescheduleHistory
                    .slice()
                    .reverse()
                    .map((h, i) => (
                      <div key={i} className={classes.historyItem}>
                        <div>
                          Previous: {h.previousDate} at {h.previousTime}
                        </div>
                        <div className={classes.reason}>{h.reason}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className={classes.actions}>
              {!expired ? (
                <a
                  href={item.interviewLink}
                  target="_blank"
                  rel="noreferrer"
                  className={classes.joinBtn}
                >
                  Join Meeting
                </a>
              ) : (
                <span className={classes.expiredText}>Interview Completed</span>
              )}

              {/* REQUEST RESCHEDULE */}
              {!expired && (
                <div className={classes.rescheduleBox}>
                  <textarea
                    placeholder="Request reschedule reason..."
                    value={requestInputs[item.id] || ""}
                    onChange={(e) =>
                      setRequestInputs((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                  />

                  <button onClick={() => requestReschedule(item.id)}>
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
