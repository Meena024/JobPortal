import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { jobSeekerActions } from "../../../store/jobSeekerSlice";

import styles from "./AppliedJobs.module.css";

const AppliedJobs = () => {
  const dispatch = useDispatch();

  const highlightedRef = useRef(null);

  /* =====================================================
     REDUX DATA
  ===================================================== */

  const jobsData = useSelector((state) => state.jobs.allJobs || []);

  const applications = useSelector((state) => state.jobs.appliedJobs || []);

  const highlightedApplicationId = useSelector(
    (state) => state.jobs.highlightedApplicationId,
  );

  /* =====================================================
     FILTER STATE
  ===================================================== */

  const [statusFilter, setStatusFilter] = useState("all");

  const [openingStatusFilter, setOpeningStatusFilter] = useState("all");

  /* =====================================================
     ENRICH APPLICATIONS
  ===================================================== */

  const enrichedApplications = useMemo(() => {
    const jobsMap = {};

    jobsData.forEach((job) => {
      jobsMap[job.id] = job;
    });

    return applications.map((app) => {
      const job = jobsMap[app.jobId];

      return {
        ...app,

        jobTitle: job?.title || "Job removed",

        companyName: job?.companyName || "Unknown company",

        description: job?.description || "This job is no longer available.",

        salary: job?.salary || "-",

        location: job?.location || "-",

        jobExists: Boolean(job),

        jobOpeningStatus: job?.jobOpeningStatus || "open",
      };
    });
  }, [applications, jobsData]);

  /* =====================================================
     FILTER APPLICATIONS
  ===================================================== */

  const filteredApplications = useMemo(() => {
    if (highlightedApplicationId) {
      return enrichedApplications;
    }

    let updated = [...enrichedApplications];

    if (statusFilter !== "all") {
      updated = updated.filter((app) => app.status === statusFilter);
    }

    if (openingStatusFilter !== "all") {
      updated = updated.filter(
        (app) => app.jobOpeningStatus === openingStatusFilter,
      );
    }

    return updated;
  }, [
    enrichedApplications,
    statusFilter,
    openingStatusFilter,
    highlightedApplicationId,
  ]);

  /* =====================================================
     SCROLL TO HIGHLIGHTED APPLICATION
  ===================================================== */

  useEffect(() => {
    if (!highlightedApplicationId) {
      return;
    }

    const timer = setTimeout(() => {
      highlightedRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [highlightedApplicationId, filteredApplications.length]);

  /* =====================================================
     CLEAR HIGHLIGHT
  ===================================================== */

  useEffect(() => {
    if (!highlightedApplicationId) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(jobSeekerActions.clearHighlightedApplication());
    }, 4000);

    return () => clearTimeout(timer);
  }, [highlightedApplicationId, dispatch]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className={styles.wrapper}>
      {/* =================================================
          HEADER
      ================================================= */}

      <header className={styles.headerRow}>
        <h1 className={styles.title}>Applied Jobs</h1>

        <div className={styles.filters}>
          {/* STATUS */}

          <select
            className={styles.filterDropdown}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Statuses</option>

            <option value="pending">Pending</option>

            <option value="reviewed">Reviewed</option>

            <option value="shortlisted">Shortlisted</option>

            <option value="selected">Selected</option>

            <option value="rejected">Rejected</option>
          </select>

          {/* OPENING STATUS */}

          <select
            className={styles.filterDropdown}
            value={openingStatusFilter}
            onChange={(event) => setOpeningStatusFilter(event.target.value)}
          >
            <option value="all">All Openings</option>

            <option value="open">Open</option>

            <option value="closed">Closed</option>
          </select>
        </div>
      </header>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filteredApplications.length === 0 ? (
        <p className={styles.infoMessage}>No applications found.</p>
      ) : (
        <div className={styles.list}>
          {filteredApplications.map((app) => {
            const interview = app.interviewData;

            const hasUpcomingInterview =
              app.jobOpeningStatus !== "closed" &&
              interview?.interviewScheduled;

            let upcomingInterview = false;

            if (hasUpcomingInterview) {
              const interviewDateTime = new Date(
                `${interview.interviewDate}T${interview.interviewTime}`,
              );

              upcomingInterview =
                !Number.isNaN(interviewDateTime.getTime()) &&
                interviewDateTime.getTime() > Date.now();
            }

            const isHighlighted = highlightedApplicationId === app.id;

            return (
              <article
                key={app.id}
                ref={isHighlighted ? highlightedRef : null}
                className={[
                  styles.card,
                  styles[app.status],
                  app.jobOpeningStatus === "closed" ? styles.closed : "",
                  isHighlighted ? styles.highlightCard : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* =================================================
                    HEADER
                ================================================= */}

                <div className={styles.cardHeader}>
                  <div className={styles.heading}>
                    <h3 className={styles.jobTitle}>{app.jobTitle}</h3>

                    <p className={styles.companyName}>{app.companyName}</p>
                  </div>

                  <div className={styles.status}>
                    <span
                      className={`${styles.statusBadge} ${styles[app.status] || ""}`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    META
                ================================================= */}

                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Location</span>

                    <span className={styles.metaValue}>{app.location}</span>
                  </div>

                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Salary</span>

                    <span className={styles.metaValue}>
                      {app.salary !== "-" ? `₹ ${app.salary}` : "-"}
                    </span>
                  </div>

                  {app.resumeUrl && (
                    <button
                      type="button"
                      className={styles.resumeLink}
                      onClick={() =>
                        window.open(
                          app.resumeUrl,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                    >
                      View Resume
                    </button>
                  )}
                </div>

                {/* =================================================
                    DESCRIPTION
                ================================================= */}
                <div>
                  <span className={styles.metaLabel}>DESCRIPTION: </span>
                  <span className={styles.description}>{app.description}</span>
                </div>

                {/* =================================================
                    UPCOMING INTERVIEW
                ================================================= */}

                {upcomingInterview && (
                  <div className={styles.interviewRow}>
                    <strong className={styles.interviewTitle}>
                      Upcoming Interview
                    </strong>

                    <span className={styles.interviewDateTime}>
                      {interview.interviewDate} · {interview.interviewTime}
                    </span>

                    {interview.interviewInstructions && (
                      <span className={styles.interviewInstructions}>
                        {interview.interviewInstructions}
                      </span>
                    )}
                  </div>
                )}

                {/* =================================================
                    OFFER LETTER
                ================================================= */}

                {app.status === "selected" && app.offerLetter.url && (
                  <button
                    type="button"
                    className={styles.offerLetter}
                    onClick={() =>
                      window.open(
                        app.offerLetter.url,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    View Offer Letter
                  </button>
                )}

                {/* =================================================
                    JOB REMOVED / CLOSED
                ================================================= */}

                {!app.jobExists && (
                  <span className={styles.removedBadge}>
                    Job no longer available
                  </span>
                )}

                {app.jobOpeningStatus === "closed" && (
                  <span className={styles.closedBadge}>Recruitment Closed</span>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AppliedJobs;
