import { useMemo } from "react";
import { useSelector } from "react-redux";

import classes from "../../../Styling/Pages/AdminDashboard/AllJobs.module.css";

const AllJobs = () => {
  const { allJobs, loading } = useSelector((state) => state.admin);

  /*
    FILTER APPROVED + REJECTED JOBS
  */

  const jobs = useMemo(() => {
    return allJobs.filter(
      (job) => job.status === "approved" || job.status === "rejected",
    );
  }, [allJobs]);

  return (
    <>
      <h1 className={classes.title}>All Processed Jobs</h1>

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
