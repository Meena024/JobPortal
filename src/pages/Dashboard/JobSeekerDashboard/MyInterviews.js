import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { rescheduleRequest } from "../../../store/jobSeekerActions";

import classes from "../../../Styling/Pages/JobSeekerDashboard/MyInterviews.module.css";

const MyInterviews = () => {
  const dispatch = useDispatch();
  const [requestInputs, setRequestInputs] = useState({});

  const appliedJobs = useSelector((state) => state.jobs.appliedJobs || []);
  const allJobs = useSelector((state) => state.jobs.allJobs || []);

  /*
    JOB LOOKUP
  */
  const jobsMap = useMemo(() => {
    return allJobs.reduce((acc, job) => {
      acc[job.id] = job;
      return acc;
    }, {});
  }, [allJobs]);

  /*
    INTERVIEWS
  */
  const interviews = useMemo(() => {
    return appliedJobs
      .filter((app) => app.interviewData?.interviewScheduled)
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
    return new Date() > new Date(`${date} ${time}`);
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
    const rescheduleRequestData = {
      rescheduleRequested: true,
      rescheduleRequestReason: reason,
      rescheduleRequestedAt: new Date().toISOString(),
    };
    try {
      await dispatch(rescheduleRequest(item, rescheduleRequestData));

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
    <div className={classes.container}>
      <h2>My Interviews</h2>

      {interviews.length === 0 && (
        <p className={classes.empty}>No interviews scheduled</p>
      )}

      {interviews.map((item) => {
        const interview = item.interviewData;
        const rescheduleRequestData = interview.rescheduleRequest || {};
        const rescheduleHistory = interview.rescheduleHistory || [];

        const expired = isExpired(
          interview.interviewDate,
          interview.interviewTime,
        );

        const relatedJob = jobsMap[item.jobId];

        const recruitmentClosed = relatedJob?.jobOpeningStatus === "closed";

        return (
          <div
            key={item.id}
            className={`${classes.row}
              ${expired ? classes.expired : ""}
              ${recruitmentClosed ? classes.closedRow : ""}
            `}
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
            </div>

            <div className={classes.col2}>
              {rescheduleHistory.length > 0 && (
                <div>
                  <strong>History:</strong>

                  <div className={classes.history}>
                    {[...rescheduleHistory].reverse().map((history, index) => (
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
              {recruitmentClosed ? (
                <span className={classes.closedBadge}>Recruitment Ended</span>
              ) : !expired ? (
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

              {!recruitmentClosed && !expired && (
                <>
                  {rescheduleRequestData.rescheduleRequested ? (
                    <div>
                      {rescheduleRequestData.rescheduleRequested && (
                        <div className={classes.requestBox}>
                          <strong>Reschedule Requested:</strong>

                          <div className={classes.requestReason}>
                            {rescheduleRequestData.rescheduleRequestReason}
                          </div>

                          {rescheduleRequestData.rescheduleRequestedAt && (
                            <div className={classes.requestTime}>
                              Requested at:{" "}
                              {new Date(
                                rescheduleRequestData.rescheduleRequestedAt,
                              ).toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
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
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyInterviews;
