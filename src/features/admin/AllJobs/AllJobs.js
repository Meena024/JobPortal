import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import AllJobsCard from "./AllJobsCard";

import styles from "./AllJobs.module.css";

const DISPLAY_BATCH_SIZE = 25;

const AllJobs = () => {
  const { allJobs = [], loading } = useSelector((state) => state.admin);

  /* =====================================================
     FILTER STATE
  ===================================================== */

  const [statusFilter, setStatusFilter] = useState("all");

  const [openingFilter, setOpeningFilter] = useState("all");

  const [search, setSearch] = useState("");

  /* =====================================================
     PAGINATION STATE
  ===================================================== */

  const [visibleCount, setVisibleCount] = useState(DISPLAY_BATCH_SIZE);

  /*
    Sentinel element placed below the job list.

    When this element enters the viewport,
    the next batch of jobs will be displayed.
  */

  const observerRef = useRef(null);

  /* =====================================================
     FILTERED JOBS
  ===================================================== */

  const jobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (
      allJobs
        /*
          Only processed jobs belong here.
          Pending jobs are handled by Job Approvals.
        */
        .filter((job) => job.status === "approved" || job.status === "rejected")

        /*
          APPROVAL STATUS
        */
        .filter((job) => {
          return statusFilter === "all" || job.status === statusFilter;
        })

        /*
          RECRUITMENT / OPENING STATUS
        */
        .filter((job) => {
          if (openingFilter === "all") {
            return true;
          }

          const openingStatus = job.jobOpeningStatus || "open";

          return openingStatus === openingFilter;
        })

        /*
          SEARCH
        */
        .filter((job) => {
          if (!query) {
            return true;
          }

          const searchableText = [
            job.title,
            job.recruiterEmail,
            job.companyName,
            job.location,
            job.salary,
            job.skillsRequired,
            job.description,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(query);
        })
    );
  }, [allJobs, statusFilter, openingFilter, search]);

  /* =====================================================
     RESET PAGINATION WHEN FILTERS CHANGE
  ===================================================== */

  useEffect(() => {
    setVisibleCount(DISPLAY_BATCH_SIZE);
  }, [statusFilter, openingFilter, search]);

  /* =====================================================
     VISIBLE JOBS
  ===================================================== */

  const visibleJobs = useMemo(() => {
    return jobs.slice(0, visibleCount);
  }, [jobs, visibleCount]);

  /* =====================================================
     CHECK WHETHER MORE JOBS EXIST
  ===================================================== */

  const hasMoreJobs = visibleCount < jobs.length;

  /* =====================================================
     INFINITE SCROLL
  ===================================================== */

  useEffect(() => {
    /*
      No more jobs to display.
    */

    if (!hasMoreJobs) {
      return;
    }

    const currentElement = observerRef.current;

    /*
      Sentinel does not exist yet.
    */

    if (!currentElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting) {
          return;
        }

        /*
          Display the next batch.

          Math.min() prevents visibleCount
          from exceeding the total number
          of filtered jobs.
        */

        setVisibleCount((previousCount) =>
          Math.min(previousCount + DISPLAY_BATCH_SIZE, jobs.length),
        );
      },
      {
        root: null,

        /*
          Start loading slightly before
          the user reaches the bottom.
        */

        rootMargin: "300px",

        threshold: 0,
      },
    );

    observer.observe(currentElement);

    /*
      Cleanup observer.
    */

    return () => {
      observer.disconnect();
    };
  }, [hasMoreJobs, jobs.length]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className={styles.page}>
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <header className={styles.header}>
        <div>
          <h2 className="page-title">All Jobs</h2>
        </div>

        <span className={styles.count}>
          {jobs.length} Job
          {jobs.length !== 1 && "s"}
        </span>
      </header>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className={styles.filters}>
        <select
          className={`select ${styles.filterSelect}`}
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setVisibleCount(DISPLAY_BATCH_SIZE);
          }}
          aria-label="Filter by approval status"
        >
          <option value="all">All Status</option>

          <option value="approved">Approved</option>

          <option value="rejected">Rejected</option>
        </select>

        <select
          className={`select ${styles.filterSelect}`}
          value={openingFilter}
          onChange={(event) => {
            setOpeningFilter(event.target.value);
            setVisibleCount(DISPLAY_BATCH_SIZE);
          }}
          aria-label="Filter by recruitment status"
        >
          <option value="all">All Recruitments</option>

          <option value="open">Open</option>

          <option value="closed">Closed</option>
        </select>

        <input
          type="search"
          className={`input ${styles.searchInput}`}
          placeholder="Search jobs, recruiters, companies..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setVisibleCount(DISPLAY_BATCH_SIZE);
          }}
          aria-label="Search jobs"
        />
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && <p className={styles.info}>Loading jobs...</p>}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading && jobs.length === 0 && (
        <div className={styles.empty}>
          <p>No jobs found.</p>
        </div>
      )}

      {/* =================================================
          JOB LIST
      ================================================= */}

      {!loading && jobs.length > 0 && (
        <div className={styles.jobGrid}>
          {visibleJobs.map((job) => (
            <AllJobsCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* =================================================
          INFINITE SCROLL SENTINEL
      ================================================= */}

      {!loading && hasMoreJobs && (
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

export default AllJobs;
