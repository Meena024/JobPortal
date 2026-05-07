import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { dbApi } from "../../../services/dbApi";
import { jobSeekerActions } from "../../../store/jobSeekerSlice";

import classes from "../../../Styling/Pages/JobSeekerDashboard/AppliedJobs.module.css";

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [openingStatusFilter, setOpeningStatusFilter] = useState("all");

  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();

  const highlightedApplicationId = useSelector(
    (state) => state.jobs.highlightedApplicationId,
  );

  const highlightedRef = useRef(null);

  /*
  FETCH APPLICATIONS
  */

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsData = await dbApi.get("applications");

        const jobsData = await dbApi.get("jobs");

        if (!applicationsData) {
          setApplications([]);
          setFilteredApplications([]);
          return;
        }

        const arr = Object.entries(applicationsData)
          .map(([id, value]) => ({
            id,
            ...value,
          }))
          .filter((app) => app.userId === userId)
          .map((app) => {
            const job = jobsData?.[app.jobId];

            return {
              ...app,
              jobTitle: job?.title || "Job removed",
              companyName: job?.companyName || "Unknown company",
              description:
                job?.description || "This job is no longer available.",
              salary: job?.salary || "-",
              location: job?.location || "-",
              jobExists: !!job,
              jobOpeningStatus: job?.jobOpeningStatus || "open",
            };
          });

        setApplications(arr);
        setFilteredApplications(arr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId]);

  /*
  FILTER APPLICATIONS
  */

  useEffect(() => {
    let updated = [...applications];
    if (highlightedApplicationId) {
      setStatusFilter("all");
      setOpeningStatusFilter("all");
      setFilteredApplications(applications);
      return;
    }

    if (statusFilter !== "all") {
      updated = updated.filter((app) => app.status === statusFilter);
    }

    if (openingStatusFilter !== "all") {
      updated = updated.filter(
        (app) => app.jobOpeningStatus === openingStatusFilter,
      );
    }

    setFilteredApplications(updated);
  }, [
    statusFilter,
    openingStatusFilter,
    applications,
    highlightedApplicationId,
  ]);

  /*
  SCROLL INTO VIEW AFTER RENDER
  */

  useEffect(() => {
    if (!highlightedApplicationId) return;

    setTimeout(() => {
      highlightedRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 250);
  }, [highlightedApplicationId, filteredApplications]);

  /*
  CLEAR HIGHLIGHT AFTER FEW SECONDS
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
      {/* HEADER ROW */}

      <div className={classes.headerRow}>
        <h1>Applied Jobs</h1>

        <div>
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

          <select
            className={classes.filterDropdown}
            value={openingStatusFilter}
            onChange={(e) => setOpeningStatusFilter(e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            <option value="all">All Openings</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* LOADING STATE */}

      {loading && (
        <p className={classes.infoMessage}>Loading applications...</p>
      )}

      {/* EMPTY STATE */}

      {!loading && filteredApplications.length === 0 && (
        <p className={classes.infoMessage}>No applications found</p>
      )}

      {/* APPLICATION GRID */}

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
            {/* TITLE + STATUS */}

            <div className={classes.titleRow}>
              <h3>{app.jobTitle}</h3>

              <span
                className={`${classes.status} ${classes[`${app.status}Badge`]}`}
              >
                {app.status}
              </span>
            </div>

            {/* JOB REMOVED WARNING */}

            {!app.jobExists && (
              <span className={classes.removedBadge}>
                Job no longer available
              </span>
            )}

            {/* CLOSED BADGE */}

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

            {/* RESUME BUTTON */}

            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={classes.resumeBtn}
            >
              View Resume
            </a>

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
