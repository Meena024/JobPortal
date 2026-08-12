import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteRecruiterJob,
  closeRecruiterJob,
} from "../../../store/recruiterActions";

import { recruiterActions } from "../../../store/recruiterSlice";

import { getUniqueValues } from "../../../utils/filterUtils";

import JobFilters from "./components/JobFilters";
import JobCard from "./components/JobCard";

import styles from "./MyJobs.module.css";

const DEFAULT_FILTERS = {
  title: "all",
  company: "all",
  location: "all",
  salary: "all",
  status: "all",
  openingStatus: "all",
};

const MyJobs = () => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.userId);

  const {
    recruiterJobs: jobs,
    loading,
    error,
  } = useSelector((state) => state.recruiter);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

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

      if (filters.salary !== "all") {
        const salary = Number(job.salary);

        switch (filters.salary) {
          case "0-5":
            if (salary > 500000) return false;
            break;

          case "5-10":
            if (salary <= 500000 || salary > 1000000) return false;
            break;

          case "10+":
            if (salary <= 1000000) return false;
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
      FILTER HANDLER
  ====================================================== */

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ======================================================
      ACTIONS
  ====================================================== */

  const handleEdit = (job) => {
    dispatch(recruiterActions.setEditingJob(job));
    dispatch(recruiterActions.setActiveView("create"));
  };

  const handleDelete = async (jobId) => {
    await dispatch(deleteRecruiterJob(userId, jobId));
  };

  const handleCloseRecruitment = async (jobId) => {
    await dispatch(closeRecruiterJob(userId, jobId));
  };

  /* ======================================================
      RENDER
  ====================================================== */

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>My Job Listings</h1>

          <p className="text-muted">
            View, edit and manage all your posted jobs.
          </p>
        </div>

        <div className={styles.jobCount}>
          {filteredJobs.length} Job
          {filteredJobs.length !== 1 && "s"}
        </div>
      </header>

      <JobFilters
        filters={filters}
        options={filterOptions}
        onFilterChange={handleFilterChange}
      />

      {loading && <div className="text-center text-muted">Loading jobs...</div>}

      {error && <div className="text-danger">{error}</div>}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="text-center text-muted">
          No jobs match the selected filters.
        </div>
      )}

      {!loading && filteredJobs.length > 0 && (
        <div className={styles.jobGrid}>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job}>
              {job.status === "approved" &&
                job.jobOpeningStatus !== "closed" && (
                  <button
                    className="btn btn--danger"
                    onClick={() => handleCloseRecruitment(job.id)}
                  >
                    End Recruitment
                  </button>
                )}

              {job.status !== "approved" && job.status !== "rejected" && (
                <>
                  <button
                    className="btn btn--primary"
                    onClick={() => handleEdit(job)}
                  >
                    Edit
                  </button>

                  <button
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
    </section>
  );
};

export default MyJobs;
