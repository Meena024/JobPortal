import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { saveJob, unsaveJob } from "../../../store/jobSeekerActions";
import { getUniqueValues } from "../../../utils/filterUtils";

import JobApply from "../components/JobApply";

import classes from "./AvailableJobs.module.css";

const AvailableJobs = () => {
  const dispatch = useDispatch();

  const [filteredJobs, setFilteredJobs] = useState([]);

  const [locationFilter, setLocationFilter] = useState("all");

  const [salaryFilter, setSalaryFilter] = useState("all");

  const jobs = useSelector((state) => state.jobs?.availableJobs || []);

  const savedJobs = useSelector((state) => state.jobs?.savedJobs || {});

  const userId = useSelector((state) => state.auth.userId);

  /* =====================================================
     APPLY FILTERS
  ===================================================== */

  useEffect(() => {
    let updatedJobs = [...jobs];

    if (locationFilter !== "all") {
      updatedJobs = updatedJobs.filter(
        (job) => job.location === locationFilter,
      );
    }

    if (salaryFilter !== "all") {
      updatedJobs = updatedJobs.filter((job) => {
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

    setFilteredJobs(updatedJobs);
  }, [jobs, locationFilter, salaryFilter]);

  /* =====================================================
     UNIQUE LOCATIONS
  ===================================================== */

  const uniqueLocations = getUniqueValues(jobs, "location");

  /* =====================================================
     SAVE / UNSAVE
  ===================================================== */

  const toggleSaveJob = async (jobId) => {
    try {
      if (savedJobs[jobId]) {
        await dispatch(unsaveJob(userId, jobId));
      } else {
        await dispatch(saveJob(userId, jobId));
      }
    } catch (error) {
      console.error("Unable to update saved job:", error);
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
        <h1 className="page-title">Available Jobs</h1>

        <div className={classes.filters}>
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

      {filteredJobs.length === 0 && (
        <p className="text-muted">No jobs match selected filters</p>
      )}

      {/* =================================================
          JOB GRID
      ================================================= */}

      <div className={`grid-3 ${classes.grid}`}>
        {filteredJobs.map((job) => (
          <article key={job.id} className={`card card-body-sm ${classes.card}`}>
            {/* =================================================
                TITLE + BOOKMARK
            ================================================= */}

            <div className={classes.titleRow}>
              <h3 className="card-title">{job.title}</h3>

              <button
                type="button"
                className={classes.bookmarkButton}
                onClick={() => toggleSaveJob(job.id)}
                aria-label={
                  savedJobs[job.id] ? "Remove job from saved jobs" : "Save job"
                }
              >
                {savedJobs[job.id] ? "★" : "☆"}
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
                jobId={job.id}
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

export default AvailableJobs;
