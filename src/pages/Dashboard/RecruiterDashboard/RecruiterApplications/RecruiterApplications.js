import { useState, useMemo } from "react";
import { useSelector } from "react-redux";

import ApplicationCard from "./ApplicationCard";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/RecruiterApplications.module.css";

const RecruiterApplications = () => {
  const applications = useSelector(
    (state) => state.recruiter.recruiterApplications,
  );

  const loading = useSelector((state) => state.recruiter.loading);

  const error = useSelector((state) => state.recruiter.error);

  /*
    FILTER STATE
  */

  const [statusFilter, setStatusFilter] = useState("all");

  const [jobFilter, setJobFilter] = useState("all");

  /*
    UNIQUE JOB TITLES
  */

  const jobTitles = useMemo(
    () => ["all", ...new Set(applications.map((app) => app.jobTitle))],
    [applications],
  );

  /*
    FILTERED APPLICATIONS
  */

  const filteredApplications = useMemo(() => {
    let updated = [...applications];

    if (statusFilter !== "all") {
      updated = updated.filter((app) => app.status === statusFilter);
    }

    if (jobFilter !== "all") {
      updated = updated.filter((app) => app.jobTitle === jobFilter);
    }

    return updated;
  }, [applications, statusFilter, jobFilter]);

  /*
    LOADING
  */

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.info}>Loading applications...</p>
      </div>
    );
  }

  /*
    ERROR
  */

  if (error) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.info}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}

      <div className={styles.headerRow}>
        <h2 className={styles.title}>
          Applications Received ({filteredApplications.length})
        </h2>

        <div className={styles.filters}>
          {/* STATUS FILTER */}

          <select
            className={styles.filterDropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* JOB FILTER */}

          <select
            className={styles.filterDropdown}
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            {jobTitles.map((title) => (
              <option key={title} value={title}>
                {title === "all" ? "All Jobs" : title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* EMPTY STATE */}

      {filteredApplications.length === 0 ? (
        <p className={styles.info}>
          No applications match the selected filters.
        </p>
      ) : (
        <div className={styles.grid}>
          {filteredApplications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;
