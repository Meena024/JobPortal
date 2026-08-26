import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { rescheduleInterview } from "../../../store/recruiterActions";

import InterviewRow from "./InterviewRow/InterviewRow";

import styles from "./RecruiterInterviews.module.css";

const DISPLAY_BATCH_SIZE = 25;

const RecruiterInterviews = () => {
  const dispatch = useDispatch();

  /* =====================================================
     REDUX DATA
  ===================================================== */

  const recruiterApplications = useSelector(
    (state) => state.recruiter.recruiterApplications || [],
  );

  const recruiterJobs = useSelector(
    (state) => state.recruiter.recruiterJobs || [],
  );

  /* =====================================================
     INFINITE SCROLL STATE
  ===================================================== */

  const [visibleCount, setVisibleCount] = useState(DISPLAY_BATCH_SIZE);

  /*
    Sentinel element placed below the interview grid.

    IntersectionObserver watches this element.
    When it enters the viewport, the next batch
    of interviews is displayed.
  */

  const observerRef = useRef(null);

  /* =====================================================
     JOB LOOKUP
  ===================================================== */

  const jobsMap = useMemo(() => {
    return recruiterJobs.reduce((map, job) => {
      map[job.id] = job;

      return map;
    }, {});
  }, [recruiterJobs]);

  /* =====================================================
     INTERVIEWS
  ===================================================== */

  const interviews = useMemo(() => {
    return recruiterApplications
      .filter((application) => application.interviewData?.interviewScheduled)
      .map((application) => {
        const job = jobsMap[application.jobId];

        return {
          ...application,
          recruitmentClosed: job?.jobOpeningStatus === "closed",
        };
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.interviewData?.interviewDate || ""}T${
            a.interviewData?.interviewTime || ""
          }`,
        ).getTime();

        const dateB = new Date(
          `${b.interviewData?.interviewDate || ""}T${
            b.interviewData?.interviewTime || ""
          }`,
        ).getTime();

        return dateB - dateA;
      });
  }, [recruiterApplications, jobsMap]);

  /* =====================================================
     RESET PAGINATION
  ===================================================== */

  useEffect(() => {
    /*
      If the underlying interview data changes,
      start displaying from the first batch again.
    */

    setVisibleCount(DISPLAY_BATCH_SIZE);
  }, [recruiterApplications]);

  /* =====================================================
     VISIBLE INTERVIEWS
  ===================================================== */

  const visibleInterviews = useMemo(() => {
    return interviews.slice(0, visibleCount);
  }, [interviews, visibleCount]);

  /* =====================================================
     CHECK WHETHER MORE INTERVIEWS EXIST
  ===================================================== */

  const hasMoreInterviews = visibleCount < interviews.length;

  /* =====================================================
     INFINITE SCROLL
  ===================================================== */

  useEffect(() => {
    if (!hasMoreInterviews) {
      return;
    }

    const currentElement = observerRef.current;

    if (!currentElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting) {
          return;
        }

        setVisibleCount((previousCount) =>
          Math.min(previousCount + DISPLAY_BATCH_SIZE, interviews.length),
        );
      },
      {
        root: null,

        /*
          Start loading the next batch
          before the user reaches the bottom.
        */

        rootMargin: "300px",

        threshold: 0,
      },
    );

    observer.observe(currentElement);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreInterviews, interviews.length]);

  /* =====================================================
     RESCHEDULE
  ===================================================== */

  const handleReschedule = async (interview, newDate, newTime, reason) => {
    try {
      await dispatch(rescheduleInterview(interview, newDate, newTime, reason));
    } catch (error) {
      console.error("Unable to reschedule interview:", error);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h2 className="page-title">Scheduled Interviews</h2>

          <p className="page-subtitle">
            Review scheduled interviews and manage candidate interactions.
          </p>
        </div>

        <span className={styles.count}>
          {interviews.length} Interview
          {interviews.length !== 1 && "s"}
        </span>
      </header>

      {interviews.length === 0 ? (
        <div className={`card ${styles.emptyState}`}>
          <h3 className="card-title">No Scheduled Interviews</h3>

          <p className="text-small">
            Interviews scheduled for your applications will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* =================================================
              INTERVIEW GRID
          ================================================= */}

          <div className={styles.grid}>
            {visibleInterviews.map((interview) => (
              <InterviewRow
                key={interview.id}
                interview={interview}
                recruitmentClosed={interview.recruitmentClosed}
                onReschedule={handleReschedule}
              />
            ))}
          </div>

          {/* =================================================
              INFINITE SCROLL SENTINEL
          ================================================= */}

          {hasMoreInterviews && (
            <div
              ref={observerRef}
              className={styles.loadMoreTrigger}
              aria-hidden="true"
            >
              Loading more interviews...
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default RecruiterInterviews;
