import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { getUniqueValues } from "../../../utils/filterUtils";

import ApplicationCard from "./ApplicationCard/ApplicationCard";

import styles from "./RecruiterApplications.module.css";

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

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filteredApplications.length === 0 ? (
        <p className={styles.info}>No applications found.</p>
      ) : (
        <div className={styles.grid}>
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              app={application}
              relatedJob={jobsMap[application.jobId]}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecruiterApplications;
