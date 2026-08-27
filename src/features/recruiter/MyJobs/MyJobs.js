import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  deleteRecruiterJob,
  closeRecruiterJob,
} from "../../../store/recruiterActions";

import { recruiterActions } from "../../../store/recruiterSlice";

import { getUniqueValues } from "../../../utils/filterUtils";

import JobFilters from "./components/JobFilters";
import JobCard from "./components/JobCard";

import styles from "./MyJobs.module.css";

const DISPLAY_BATCH_SIZE = 25;

const DEFAULT_FILTERS = {
  title: "all",
  company: "all",
  location: "all",
  package: "all",
  status: "all",
  openingStatus: "all",
};

const MyJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth.userId);

  const {
    recruiterJobs: jobs,
    loading,
    error,
  } = useSelector((state) => state.recruiter);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  /* ======================================================
      INFINITE SCROLL STATE
  ====================================================== */

  const [visibleCount, setVisibleCount] = useState(DISPLAY_BATCH_SIZE);

  /*
    Sentinel placed below the job grid.

    IntersectionObserver watches this element.
    When it enters the viewport, the next batch
    of jobs is displayed.
  */

  const observerRef = useRef(null);

  /* ======================================================
      FILTER OPTIONS
  ====================================================== */

  const filterOptions = useMemo(
    () => ({
      titles: getUniqueValues(jobs, "title"),
      companies: getUniqueValues(jobs, "companyName"),
      locations: getUniqueValues(jobs, "location"),
    }),
    [jobs],
  );

  /* ======================================================
      FILTERED JOBS
  ====================================================== */

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filters.title !== "all" && job.title !== filters.title) {
        return false;
      }

      if (filters.company !== "all" && job.companyName !== filters.company) {
        return false;
      }

      if (filters.location !== "all" && job.location !== filters.location) {
        return false;
      }

      if (filters.package !== "all") {
        const packageText = job.package || "";

        const numbers = packageText.match(/\d+(?:\.\d+)?/g);

        if (!numbers || numbers.length === 0) {
          return false;
        }

        const minPackage = Number(numbers[0]);

        const maxPackage = numbers.length > 1 ? Number(numbers[1]) : minPackage;

        switch (filters.package) {
          case "0 - 2 LPA":
            if (minPackage > 2) return false;
            break;

          case "2 - 4 LPA":
            if (maxPackage <= 2 || minPackage > 4) {
              return false;
            }
            break;

          case "4 - 6 LPA":
            if (maxPackage <= 4 || minPackage > 6) {
              return false;
            }
            break;

          case "6 - 8 LPA":
            if (maxPackage <= 6 || minPackage > 8) {
              return false;
            }
            break;

          case "8 - 10 LPA":
            if (maxPackage <= 8 || minPackage > 10) {
              return false;
            }
            break;

          case "10 - 12 LPA":
            if (maxPackage <= 10 || minPackage > 12) {
              return false;
            }
            break;

          case "12 - 15 LPA":
            if (maxPackage <= 12 || minPackage > 15) {
              return false;
            }
            break;

          case "15 - 20 LPA":
            if (maxPackage <= 15 || minPackage > 20) {
              return false;
            }
            break;

          case "20+ LPA":
            if (maxPackage <= 20) return false;
            break;

          default:
            break;
        }
      }

      if (filters.status !== "all" && job.status !== filters.status) {
        return false;
      }

      if (
        filters.openingStatus !== "all" &&
        (job.jobOpeningStatus || "open") !== filters.openingStatus
      ) {
        return false;
      }

      return true;
    });
  }, [jobs, filters]);

  /* ======================================================
      RESET PAGINATION WHEN FILTER CHANGES
  ====================================================== */

  useEffect(() => {
    setVisibleCount(DISPLAY_BATCH_SIZE);
  }, [filters]);

  /* ======================================================
      VISIBLE JOBS
  ====================================================== */

  const visibleJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  /* ======================================================
      CHECK WHETHER MORE JOBS EXIST
  ====================================================== */

  const hasMoreJobs = visibleCount < filteredJobs.length;

  /* ======================================================
      INFINITE SCROLL
  ====================================================== */

  useEffect(() => {
    if (!hasMoreJobs) {
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
          Math.min(previousCount + DISPLAY_BATCH_SIZE, filteredJobs.length),
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
  }, [hasMoreJobs, filteredJobs.length]);

  /* ======================================================
      FILTER HANDLER
  ====================================================== */

  const handleFilterChange = (name, value) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));
  };

  /* ======================================================
      ACTIONS
  ====================================================== */

  const handleEdit = (job) => {
    dispatch(recruiterActions.setEditingJob(job));

    navigate("/recruiter/create");
  };

  const handleDelete = async (jobId) => {
    try {
      await dispatch(deleteRecruiterJob(userId, jobId));
    } catch (error) {
      console.error("Unable to delete job:", error);
    }
  };

  const handleCloseRecruitment = async (jobId) => {
    try {
      await dispatch(closeRecruiterJob(userId, jobId));
    } catch (error) {
      console.error("Unable to close recruitment:", error);
    }
  };

  /* ======================================================
      RENDER
  ====================================================== */

  return (
    <section className={styles.page}>
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>My Job Listings</h1>
        </div>

        <div className={styles.jobCount}>
          {filteredJobs.length} Job
          {filteredJobs.length !== 1 && "s"}
        </div>
      </header>

      {/* =================================================
          FILTERS
      ================================================= */}

      <JobFilters
        filters={filters}
        options={filterOptions}
        onFilterChange={handleFilterChange}
      />

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && <div className="text-center text-muted">Loading jobs...</div>}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && <div className="text-danger">{error}</div>}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="text-center text-muted">
          No jobs match the selected filters.
        </div>
      )}

      {/* =================================================
          JOB GRID
      ================================================= */}

      {!loading && !error && filteredJobs.length > 0 && (
        <div className={styles.jobGrid}>
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job}>
              {job.status === "approved" &&
                job.jobOpeningStatus !== "closed" && (
                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={() => handleCloseRecruitment(job.id)}
                  >
                    End Recruitment
                  </button>
                )}

              {job.status !== "approved" && job.status !== "rejected" && (
                <>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => handleEdit(job)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </JobCard>
          ))}
        </div>
      )}

      {/* =================================================
          INFINITE SCROLL SENTINEL
      ================================================= */}

      {hasMoreJobs && (
        <div
          ref={observerRef}
          className={styles.loadMoreTrigger}
          aria-hidden="true"
        >
          Loading more jobs...
        </div>
      )}
    </section>
  );
};

export default MyJobs;
