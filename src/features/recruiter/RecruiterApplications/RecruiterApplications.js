import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { getUniqueValues } from "../../../utils/filterUtils";

import ApplicationProcess from "../../components/ApplicationProcess/ApplicationProcess";
import ApplicationCard from "./ApplicationCard/ApplicationCard";

import styles from "./RecruiterApplications.module.css";

const DISPLAY_BATCH_SIZE = 25;

const RecruiterApplications = () => {
  /* =====================================================
     REDUX DATA
  ===================================================== */

  const applications = useSelector(
    (state) => state.recruiter.recruiterApplications || [],
  );

  const recruiterJobs = useSelector(
    (state) => state.recruiter.recruiterJobs || [],
  );

  const loading = useSelector((state) => state.recruiter.loading);

  const error = useSelector((state) => state.recruiter.error);

  /* =====================================================
     FILTER STATE
  ===================================================== */

  const [statusFilter, setStatusFilter] = useState("all");

  const [jobFilter, setJobFilter] = useState("all");

  /* =====================================================
     INFINITE SCROLL STATE
  ===================================================== */

  const [visibleCount, setVisibleCount] = useState(DISPLAY_BATCH_SIZE);

  /*
    Sentinel element placed below the application grid.

    IntersectionObserver watches this element.
    When it enters the viewport, the next batch
    of applications is displayed.
  */

  const observerRef = useRef(null);

  /* =====================================================
     JOB LOOKUP
     O(1) lookup by job id
  ===================================================== */

  const jobsMap = useMemo(() => {
    return recruiterJobs.reduce((map, job) => {
      map[job.id] = job;

      return map;
    }, {});
  }, [recruiterJobs]);

  /* =====================================================
     FILTER OPTIONS
  ===================================================== */

  const jobTitles = useMemo(() => {
    return getUniqueValues(applications, "jobTitle");
  }, [applications]);

  /* =====================================================
     FILTERED APPLICATIONS
  ===================================================== */

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      if (statusFilter !== "all" && application.status !== statusFilter) {
        return false;
      }

      if (jobFilter !== "all" && application.jobTitle !== jobFilter) {
        return false;
      }

      return true;
    });
  }, [applications, statusFilter, jobFilter]);

  /* =====================================================
     RESET PAGINATION WHEN FILTER CHANGES
  ===================================================== */

  useEffect(() => {
    setVisibleCount(DISPLAY_BATCH_SIZE);
  }, [statusFilter, jobFilter]);

  /* =====================================================
     VISIBLE APPLICATIONS
  ===================================================== */

  const visibleApplications = useMemo(() => {
    return filteredApplications.slice(0, visibleCount);
  }, [filteredApplications, visibleCount]);

  /* =====================================================
     CHECK WHETHER MORE APPLICATIONS EXIST
  ===================================================== */

  const hasMoreApplications = visibleCount < filteredApplications.length;

  /* =====================================================
     INFINITE SCROLL
  ===================================================== */

  useEffect(() => {
    if (!hasMoreApplications) {
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
          Math.min(
            previousCount + DISPLAY_BATCH_SIZE,
            filteredApplications.length,
          ),
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
  }, [hasMoreApplications, filteredApplications.length]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.info}>Loading applications...</p>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.info}>{error}</p>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className={styles.wrapper}>
      {/* =================================================
          HEADER
      ================================================= */}

      <header className={styles.headerRow}>
        <h2 className={styles.title}>
          Applications ({filteredApplications.length})
        </h2>

        <div className={styles.filters}>
          {/* =============================================
              STATUS FILTER
          ============================================= */}

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

          {/* =============================================
              JOB FILTER
          ============================================= */}

          <select
            className={styles.filterDropdown}
            value={jobFilter}
            onChange={(event) => setJobFilter(event.target.value)}
          >
            <option value="all">All Jobs</option>

            {jobTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
      </header>
      <ApplicationProcess />

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filteredApplications.length === 0 ? (
        <p className={styles.info}>No applications found.</p>
      ) : (
        <>
          {/* =================================================
              APPLICATION GRID
          ================================================= */}

          <div className={styles.grid}>
            {visibleApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                app={application}
                relatedJob={jobsMap[application.jobId]}
              />
            ))}
          </div>

          {/* =================================================
              INFINITE SCROLL SENTINEL
          ================================================= */}

          {hasMoreApplications && (
            <div
              ref={observerRef}
              className={styles.loadMoreTrigger}
              aria-hidden="true"
            >
              Loading more applications...
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default RecruiterApplications;
