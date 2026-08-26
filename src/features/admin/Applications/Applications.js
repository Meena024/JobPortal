import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { getUniqueValues } from "../../../utils/filterUtils";

import ApplicationCard from "./ApplicationCard";

import styles from "./Applications.module.css";

const DISPLAY_BATCH_SIZE = 25;

const Applications = () => {
  const allApplications = useSelector(
    (state) => state.admin.allApplications || [],
  );

  const allJobs = useSelector((state) => state.admin.allJobs || []);

  /* =====================================================
     FILTER STATE
  ===================================================== */

  const [applicantFilter, setApplicantFilter] = useState("all");

  const [recruiterFilter, setRecruiterFilter] = useState("all");

  const [jobFilter, setJobFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const [search, setSearch] = useState("");

  /* =====================================================
     INFINITE SCROLL STATE
  ===================================================== */

  const [visibleCount, setVisibleCount] = useState(DISPLAY_BATCH_SIZE);

  /*
    Sentinel placed below the application grid.

    IntersectionObserver watches this element.
    When it becomes visible, the next batch
    of applications is displayed.
  */

  const observerRef = useRef(null);

  /* =====================================================
     JOB LOOKUP
  ===================================================== */

  const jobsMap = useMemo(() => {
    return allJobs.reduce((map, job) => {
      map[job.id] = job;

      return map;
    }, {});
  }, [allJobs]);

  /* =====================================================
     FILTER OPTIONS
  ===================================================== */

  const filterOptions = useMemo(
    () => ({
      applicants: getUniqueValues(allApplications, "applicantEmail"),

      recruiters: getUniqueValues(allApplications, "recruiterEmail"),

      jobs: getUniqueValues(allApplications, "jobTitle"),

      statuses: getUniqueValues(allApplications, "status"),
    }),
    [allApplications],
  );

  /* =====================================================
     FILTERED APPLICATIONS
  ===================================================== */

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allApplications.filter((application) => {
      if (
        applicantFilter !== "all" &&
        application.applicantEmail !== applicantFilter
      ) {
        return false;
      }

      if (
        recruiterFilter !== "all" &&
        application.recruiterEmail !== recruiterFilter
      ) {
        return false;
      }

      if (jobFilter !== "all" && application.jobTitle !== jobFilter) {
        return false;
      }

      if (statusFilter !== "all" && application.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        application.applicantEmail,
        application.jobTitle,
        application.recruiterEmail,
        application.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [
    allApplications,
    applicantFilter,
    recruiterFilter,
    jobFilter,
    statusFilter,
    search,
  ]);

  /* =====================================================
     RESET PAGINATION WHEN FILTER CHANGES
  ===================================================== */

  useEffect(() => {
    setVisibleCount(DISPLAY_BATCH_SIZE);
  }, [applicantFilter, recruiterFilter, jobFilter, statusFilter, search]);

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
          Start loading slightly before
          the user reaches the bottom.
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
     RENDER
  ===================================================== */

  return (
    <section className={styles.page}>
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <header className={styles.header}>
        <div>
          <h2 className="page-title">Job Applications</h2>
        </div>

        <span className={styles.count}>
          {filteredApplications.length} Application
          {filteredApplications.length !== 1 && "s"}
        </span>
      </header>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className={styles.filters}>
        <select
          className={`select ${styles.filterSelect}`}
          value={applicantFilter}
          onChange={(event) => setApplicantFilter(event.target.value)}
          aria-label="Filter by applicant"
        >
          <option value="all">All Applicants</option>

          {filterOptions.applicants.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>

        <select
          className={`select ${styles.filterSelect}`}
          value={recruiterFilter}
          onChange={(event) => setRecruiterFilter(event.target.value)}
          aria-label="Filter by recruiter"
        >
          <option value="all">All Recruiters</option>

          {filterOptions.recruiters.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>

        <select
          className={`select ${styles.filterSelect}`}
          value={jobFilter}
          onChange={(event) => setJobFilter(event.target.value)}
          aria-label="Filter by job"
        >
          <option value="all">All Jobs</option>

          {filterOptions.jobs.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>

        <select
          className={`select ${styles.filterSelect}`}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by application status"
        >
          <option value="all">All Statuses</option>

          {filterOptions.statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="search"
          className={`input ${styles.searchInput}`}
          placeholder="Search applicant, recruiter or job..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search applications"
        />
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filteredApplications.length === 0 && (
        <div className={styles.empty}>
          No applications match the selected filters.
        </div>
      )}

      {/* =================================================
          APPLICATION LIST
      ================================================= */}

      {filteredApplications.length > 0 && (
        <div className={styles.applicationGrid}>
          {visibleApplications.map((application) => {
            const relatedJob = jobsMap[application.jobId];

            const recruitmentClosed = relatedJob?.jobOpeningStatus === "closed";

            return (
              <ApplicationCard
                key={application.id}
                application={application}
                recruitmentClosed={recruitmentClosed}
              />
            );
          })}
        </div>
      )}

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
    </section>
  );
};

export default Applications;
