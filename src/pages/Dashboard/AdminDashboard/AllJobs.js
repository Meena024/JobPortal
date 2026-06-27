import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import classes from "../../../Styling/Pages/AdminDashboard/AllJobs.module.css";

const AllJobs = () => {
  const { allJobs, loading } = useSelector((state) => state.admin);

  /*
    FILTER STATES
  */

  const [statusFilter, setStatusFilter] = useState("all");
  const [openingFilter, setOpeningFilter] = useState("all");
  const [search, setSearch] = useState("");

  /*
    FILTER JOBS
  */

  const jobs = useMemo(() => {
    let filtered = allJobs.filter(
      (job) => job.status === "approved" || job.status === "rejected",
    );

    /*
      STATUS FILTER
    */

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    /*
      OPENING STATUS FILTER
    */

    if (openingFilter === "open") {
      filtered = filtered.filter((job) => job.jobOpeningStatus !== "closed");
    } else if (openingFilter === "closed") {
      filtered = filtered.filter((job) => job.jobOpeningStatus === "closed");
    }

    /*
      SEARCH FILTER
    */

    const query = search.trim().toLowerCase();

    if (query) {
      filtered = filtered.filter((job) =>
        [
          job.recruiterEmail,
          job.companyName,
          job.location,
          job.salary,
          job.skillsRequired,
          job.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query),
      );
    }

    return filtered;
  }, [allJobs, statusFilter, openingFilter, search]);

  return (
    <>
      <h1 className={classes.title}>All Processed Jobs</h1>

      <div className={classes.filters}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={openingFilter}
          onChange={(e) => setOpeningFilter(e.target.value)}
        >
          <option value="all">All Recruitments</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <input
          type="text"
          placeholder="Search recruiter, company, location, salary, skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className={classes.info}>Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p className={classes.empty}>No jobs found</p>
      )}

      <div className={classes.jobGrid}>
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`${classes.jobCard} ${classes[job.status]}`}
          >
            <div className={classes.headerRow}>
              <div className={classes.jobTitle}>{job.title}</div>

              <div className={classes.badges}>
                <span
                  className={`${classes.status} ${
                    job.status === "rejected"
                      ? classes.rejectedBadge
                      : job.jobOpeningStatus === "closed"
                        ? classes.closedBadge
                        : classes.approvedBadge
                  }`}
                >
                  {job.status === "rejected"
                    ? "Rejected"
                    : job.jobOpeningStatus === "closed"
                      ? "Recruitment Closed"
                      : "Approved"}
                </span>
              </div>
            </div>

            <div className={classes.metaBlock}>
              <span>
                Recruiter: <span>{job.recruiterEmail}</span>
              </span>
            </div>

            <div className={classes.metaRow}>
              <div className={classes.metaBlock}>
                <span>Company</span>
                <p>{job.companyName}</p>
              </div>

              <div className={classes.metaBlock}>
                <span>Location</span>
                <p>{job.location}</p>
              </div>

              <div className={classes.metaBlock}>
                <span>Salary</span>
                <p>₹{job.salary}</p>
              </div>
            </div>

            <div className={classes.skills}>{job.skillsRequired}</div>

            <div className={classes.description}>{job.description}</div>

            {job.status === "rejected" && job.rejectionReason && (
              <div className={classes.rejectionBox}>
                <strong>Reason:</strong> {job.rejectionReason}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default AllJobs;
