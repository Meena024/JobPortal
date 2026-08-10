import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import ApplicationCard from "./ApplicationCard/ApplicationCard";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/RecruiterApplications.module.css";

const RecruiterApplications = () => {
  const applications = useSelector(
    (state) => state.recruiter.recruiterApplications || [],
  );

  const recruiterJobs = useSelector(
    (state) => state.recruiter.recruiterJobs || [],
  );

  const loading = useSelector((state) => state.recruiter.loading);

  const error = useSelector((state) => state.recruiter.error);

  /*
   * FILTERS
   */

  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");

  /*
   * JOB LOOKUP MAP
   * O(1) lookup instead of find() inside every card
   */

  const jobsMap = useMemo(() => {
    return recruiterJobs.reduce((map, job) => {
      map[job.id] = job;
      return map;
    }, {});
  }, [recruiterJobs]);

  /*
   * JOB TITLES
   */

  const jobTitles = useMemo(() => {
    return ["all", ...new Set(applications.map((app) => app.jobTitle))];
  }, [applications]);

  /*
   * FILTERED APPLICATIONS
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
   * LOADING
   */

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.info}>Loading applications...</p>
      </div>
    );
  }

  /*
   * ERROR
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
          Applications ({filteredApplications.length})
        </h2>

        <div className={styles.filters}>
          {/* STATUS */}

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

          {/* JOB */}

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

      {/* EMPTY */}

      {filteredApplications.length === 0 ? (
        <p className={styles.info}>No applications found.</p>
      ) : (
        <div className={styles.grid}>
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              relatedJob={jobsMap[app.jobId]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;
