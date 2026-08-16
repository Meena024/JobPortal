import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import AllJobsCard from "./AllJobsCard";

import styles from "./AllJobs.module.css";

const AllJobs = () => {
  const { allJobs = [], loading } = useSelector((state) => state.admin);

  /* =====================================================
     FILTER STATE
  ===================================================== */

  const [statusFilter, setStatusFilter] = useState("all");

  const [openingFilter, setOpeningFilter] = useState("all");

  const [search, setSearch] = useState("");

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
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by approval status"
        >
          <option value="all">All Status</option>

          <option value="approved">Approved</option>

          <option value="rejected">Rejected</option>
        </select>

        <select
          className={`select ${styles.filterSelect}`}
          value={openingFilter}
          onChange={(event) => setOpeningFilter(event.target.value)}
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
          onChange={(event) => setSearch(event.target.value)}
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
          {jobs.map((job) => (
            <AllJobsCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
};

export default AllJobs;
