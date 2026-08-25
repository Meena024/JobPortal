import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { unsaveJob } from "../../../store/jobSeekerActions";
import { getUniqueValues } from "../../../utils/filterUtils";

import JobApply from "../components/JobApply";

import classes from "./SavedJobs.module.css";

const SavedJobs = () => {
  const dispatch = useDispatch();

  /* =====================================================
     REDUX DATA
  ===================================================== */

  const userId = useSelector((state) => state.auth.userId);

  const savedJobs = useSelector((state) => state.jobs?.savedJobs || {});

  const availableJobs = useSelector((state) => state.jobs?.availableJobs || []);

  /* =====================================================
     FILTER STATE
  ===================================================== */

  const [titleFilter, setTitleFilter] = useState("all");

  const [companyFilter, setCompanyFilter] = useState("all");

  const [locationFilter, setLocationFilter] = useState("all");

  const [salaryFilter, setSalaryFilter] = useState("all");

  /* =====================================================
     SAVED JOBS
  ===================================================== */

  const savedJobsList = useMemo(() => {
    return availableJobs
      .filter((job) => savedJobs[job.id])
      .filter((job) => job.jobOpeningStatus !== "closed")
      .map((job) => ({
        jobId: job.id,
        userId: job.userId,
        recruiterEmail: job.recruiterEmail,

        title: job.title,
        companyName: job.companyName,
        location: job.location,
        description: job.description,
        salary: job.salary,

        jobExists: true,
      }));
  }, [availableJobs, savedJobs]);

  /* =====================================================
     FILTER OPTIONS
  ===================================================== */

  const uniqueTitles = getUniqueValues(savedJobsList, "title");

  const uniqueCompanies = getUniqueValues(savedJobsList, "companyName");

  const uniqueLocations = getUniqueValues(savedJobsList, "location");

  /* =====================================================
     FILTERED JOBS
  ===================================================== */

  const filteredSavedJobs = useMemo(() => {
    let updated = [...savedJobsList];

    /* -------------------------------------------------
       TITLE
    ------------------------------------------------- */

    if (titleFilter !== "all") {
      updated = updated.filter((job) => job.title === titleFilter);
    }

    /* -------------------------------------------------
       COMPANY
    ------------------------------------------------- */

    if (companyFilter !== "all") {
      updated = updated.filter((job) => job.companyName === companyFilter);
    }

    /* -------------------------------------------------
       LOCATION
    ------------------------------------------------- */

    if (locationFilter !== "all") {
      updated = updated.filter((job) => job.location === locationFilter);
    }

    /* -------------------------------------------------
       SALARY
    ------------------------------------------------- */

    if (salaryFilter !== "all") {
      updated = updated.filter((job) => {
        const salary = Number(job.salary);

        if (salaryFilter === "0-5") {
          return salary <= 500000;
        }

        if (salaryFilter === "5-10") {
          return salary > 500000 && salary <= 1000000;
        }

        if (salaryFilter === "10+") {
          return salary > 1000000;
        }

        return true;
      });
    }

    return updated;
  }, [savedJobsList, titleFilter, companyFilter, locationFilter, salaryFilter]);

  /* =====================================================
     REMOVE SAVED JOB
  ===================================================== */

  const removeSavedJobHandler = async (jobId) => {
    try {
      await dispatch(unsaveJob(userId, jobId));
    } catch (error) {
      console.error("Unable to remove saved job:", error);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className={classes.page}>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className={classes.headerRow}>
        <h1 className="page-title">Saved Jobs</h1>

        <div className={classes.filters}>
          {/* TITLE */}

          <select
            className="input"
            value={titleFilter}
            onChange={(event) => setTitleFilter(event.target.value)}
          >
            <option value="all">All Titles</option>

            {uniqueTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>

          {/* COMPANY */}

          <select
            className="input"
            value={companyFilter}
            onChange={(event) => setCompanyFilter(event.target.value)}
          >
            <option value="all">All Companies</option>

            {uniqueCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>

          {/* LOCATION */}

          <select
            className="input"
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
          >
            <option value="all">All Locations</option>

            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          {/* SALARY */}

          <select
            className="input"
            value={salaryFilter}
            onChange={(event) => setSalaryFilter(event.target.value)}
          >
            <option value="all">All Salaries</option>

            <option value="0-5">0 – 5 LPA</option>

            <option value="5-10">5 – 10 LPA</option>

            <option value="10+">10+ LPA</option>
          </select>
        </div>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filteredSavedJobs.length === 0 && (
        <p className="text-muted">No saved jobs match selected filters</p>
      )}

      {/* =================================================
          JOB GRID
      ================================================= */}

      <div className={`grid-3 ${classes.grid}`}>
        {filteredSavedJobs.map((job) => (
          <article
            key={job.jobId}
            className={`card card-body-sm ${classes.card}`}
          >
            {/* =================================================
                TITLE + BOOKMARK
            ================================================= */}

            <div className={classes.titleRow}>
              <h3 className="card-title">{job.title}</h3>

              <button
                type="button"
                className={classes.bookmarkButton}
                onClick={() => removeSavedJobHandler(job.jobId)}
                aria-label="Remove job from saved jobs"
              >
                ★
              </button>
            </div>

            {/* =================================================
                COMPANY
            ================================================= */}

            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Company:</span>

              <span className={classes.metaValue}>{job.companyName}</span>
            </div>

            {/* =================================================
                LOCATION
            ================================================= */}

            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Location:</span>

              <span className={classes.metaValue}>{job.location}</span>
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p className={`${classes.description} text-small`}>
              {job.description}
            </p>

            {/* =================================================
                SALARY
            ================================================= */}

            <div className={classes.salary}>₹ {job.salary} / Year</div>

            {/* =================================================
                APPLY
            ================================================= */}

            <div className={classes.apply}>
              <JobApply
                jobId={job.jobId}
                recruiterId={job.userId}
                recruiterEmail={job.recruiterEmail}
                jobTitle={job.title}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
