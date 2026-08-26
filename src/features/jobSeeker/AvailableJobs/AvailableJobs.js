import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { saveJob, unsaveJob } from "../../../store/jobSeekerActions";
import { getUniqueValues } from "../../../utils/filterUtils";

import JobApply from "../components/JobApply";

import classes from "./AvailableJobs.module.css";

const DISPLAY_BATCH_SIZE = 25;

const AvailableJobs = () => {
  const dispatch = useDispatch();

  /* =====================================================
     FILTER STATE
  ===================================================== */

  const [locationFilter, setLocationFilter] = useState("all");

  const [salaryFilter, setSalaryFilter] = useState("all");

  /* =====================================================
     INFINITE SCROLL STATE
  ===================================================== */

  const [visibleCount, setVisibleCount] = useState(DISPLAY_BATCH_SIZE);

  /*
    This element will sit below the job list.

    When it becomes visible, IntersectionObserver
    will load the next batch of jobs.
  */
  const observerRef = useRef(null);

  /* =====================================================
     REDUX DATA
  ===================================================== */

  const jobs = useSelector((state) => state.jobs?.availableJobs || []);

  const savedJobs = useSelector((state) => state.jobs?.savedJobs || {});

  const userId = useSelector((state) => state.auth.userId);

  /* =====================================================
     APPLY FILTERS
  ===================================================== */

  const filteredJobs = useMemo(() => {
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

    return updatedJobs;
  }, [jobs, locationFilter, salaryFilter]);

  /* =====================================================
     RESET VISIBLE COUNT WHEN FILTER CHANGES
  ===================================================== */

  useEffect(() => {
    setVisibleCount(DISPLAY_BATCH_SIZE);
  }, [locationFilter, salaryFilter]);

  /* =====================================================
     VISIBLE JOBS
  ===================================================== */

  const visibleJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  /* =====================================================
     CHECK WHETHER MORE JOBS EXIST
  ===================================================== */

  const hasMoreJobs = visibleCount < filteredJobs.length;

  /* =====================================================
     INFINITE SCROLL
  ===================================================== */

  useEffect(() => {
    /*
      If all filtered jobs are already visible,
      there is nothing left to observe.
    */

    if (!hasMoreJobs) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting) {
          return;
        }

        /*
          Reveal the next 25 jobs.

          Math.min() prevents visibleCount from
          becoming larger than the number of jobs.
        */

        setVisibleCount((previousCount) =>
          Math.min(previousCount + DISPLAY_BATCH_SIZE, filteredJobs.length),
        );
      },
      {
        /*
          Start loading before the user reaches
          the absolute bottom.
        */
        root: null,

        rootMargin: "300px",

        threshold: 0,
      },
    );

    /*
      Save the current DOM element.
    */

    const currentElement = observerRef.current;

    /*
      Start observing the sentinel.
    */

    if (currentElement) {
      observer.observe(currentElement);
    }

    /*
      Cleanup.

      This is important because the component may
      re-render and create a new observer.
    */

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }

      observer.disconnect();
    };
  }, [hasMoreJobs, filteredJobs.length]);

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

      {filteredJobs.length > 0 && (
        <div className={`grid-3 ${classes.grid}`}>
          {visibleJobs.map((job) => (
            <article
              key={job.id}
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
                  onClick={() => toggleSaveJob(job.id)}
                  aria-label={
                    savedJobs[job.id]
                      ? "Remove job from saved jobs"
                      : "Save job"
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
                  recruiterCompany={job.companyName}
                  jobTitle={job.title}
                />
              </div>
            </article>
          ))}
        </div>
      )}

      {/* =================================================
          INFINITE SCROLL SENTINEL
      ================================================= */}

      {hasMoreJobs && (
        <div
          ref={observerRef}
          className={classes.loadMoreTrigger}
          aria-hidden="true"
        >
          Loading more jobs...
        </div>
      )}
    </div>
  );
};

export default AvailableJobs;
