import { useEffect, useMemo, useState, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";

import { jobSeekerActions } from "../../../store/jobSeekerSlice";

import classes from "../../../Styling/Pages/JobSeekerDashboard/AppliedJobs.module.css";

const AppliedJobs = () => {
  const dispatch = useDispatch();

  const highlightedRef = useRef(null);

  /*
    REDUX STATE
  */

  const applications = useSelector((state) => state.jobs.appliedJobs || []);

  const highlightedApplicationId = useSelector(
    (state) => state.jobs.highlightedApplicationId,
  );

  const jobsData = useSelector((state) => state.jobs.availableJobs);

  /*
    LOCAL UI STATE
  */

  const [statusFilter, setStatusFilter] = useState("all");

  const [openingStatusFilter, setOpeningStatusFilter] = useState("all");

  /*
    ENRICH APPLICATIONS
  */

  const enrichedApplications = useMemo(() => {
    const jobsMap = {};

    (jobsData || []).forEach((job) => {
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

        jobExists: !!job,

        jobOpeningStatus: job?.jobOpeningStatus || "open",
      };
    });
  }, [applications, jobsData]);

  /*
    APPLY FILTERS
  */

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

  /*
    SCROLL TO
    HIGHLIGHTED CARD
  */

  useEffect(() => {
    if (!highlightedApplicationId) return;

    setTimeout(() => {
      highlightedRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 250);
  }, [highlightedApplicationId, filteredApplications.length]);

  /*
    CLEAR HIGHLIGHT
  */

  useEffect(() => {
    if (!highlightedApplicationId) return;

    const timer = setTimeout(() => {
      dispatch(jobSeekerActions.clearHighlightedApplication());
    }, 4000);

    return () => clearTimeout(timer);
  }, [highlightedApplicationId, dispatch]);

  return (
    <div>
      {/* HEADER */}

      <div className={classes.headerRow}>
        <h1>Applied Jobs</h1>

        <div>
          {/* STATUS FILTER */}

          <select
            className={classes.filterDropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>

            <option value="pending">Pending</option>

            <option value="reviewed">Reviewed</option>

            <option value="shortlisted">Shortlisted</option>

            <option value="selected">Selected</option>

            <option value="rejected">Rejected</option>
          </select>

          {/* OPENING FILTER */}

          <select
            className={classes.filterDropdown}
            value={openingStatusFilter}
            onChange={(e) => setOpeningStatusFilter(e.target.value)}
            style={{
              marginLeft: "8px",
            }}
          >
            <option value="all">All Openings</option>

            <option value="open">Open</option>

            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* EMPTY */}

      {filteredApplications.length === 0 && (
        <p className={classes.infoMessage}>No applications found</p>
      )}

      {/* GRID */}

      <div className={classes.grid}>
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            ref={highlightedApplicationId === app.id ? highlightedRef : null}
            className={`${classes.card}

              ${
                app.jobOpeningStatus === "closed"
                  ? classes.closed
                  : classes[app.status]
              }

              ${
                highlightedApplicationId === app.id ? classes.highlightCard : ""
              }`}
          >
            {/* TITLE */}

            <div className={classes.titleRow}>
              <h3>{app.jobTitle}</h3>

              <span
                className={`${classes.status}
                  ${classes[`${app.status}Badge`]}`}
              >
                {app.status}
              </span>
            </div>

            {/* REMOVED */}

            {!app.jobExists && (
              <span className={classes.removedBadge}>
                Job no longer available
              </span>
            )}

            {/* CLOSED */}

            {app.jobOpeningStatus === "closed" && (
              <span className={classes.closedBadge}>Recruitment Closed</span>
            )}

            {/* COMPANY */}

            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Company:</span>{" "}
              {app.companyName}, {app.location}
            </div>

            {/* DESCRIPTION */}

            <p className={classes.description}>{app.description}</p>

            {/* SALARY */}

            <div className={classes.salary}>
              {app.salary !== "-" ? `₹ ${app.salary}` : "-"}
            </div>

            {/* RESUME */}

            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={classes.resumeBtn}
            >
              View Resume
            </a>
            {(() => {
              const interview = app.interviewData;

              if (!interview?.interviewScheduled) return null;

              const interviewDateTime = new Date(
                `${interview.interviewDate} ${interview.interviewTime}`,
              );

              if (interviewDateTime <= new Date()) return null;

              return (
                <div className={classes.interviewBox}>
                  <div className={classes.interviewTitle}>
                    Upcoming Interview
                  </div>

                  <div className={classes.interviewMeta}>
                    <span>{interview.interviewDate}</span>
                    <span>
                      <span className={classes.interviewLabel}>Time: </span>
                      {interview.interviewTime}
                    </span>
                  </div>

                  {interview.interviewInstructions && (
                    <div className={classes.interviewInstructions}>
                      {interview.interviewInstructions}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* OFFER LETTER */}

            {app.status === "selected" && app.offerLetterUrl && (
              <a
                href={app.offerLetterUrl}
                target="_blank"
                rel="noreferrer"
                className={classes.resumeBtn}
              >
                View Offer Letter
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedJobs;
