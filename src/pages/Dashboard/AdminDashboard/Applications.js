import { useMemo, useState } from "react";

import { useSelector } from "react-redux";

import classes from "../../../Styling/Pages/AdminDashboard/Applications.module.css";

const Applications = () => {
  const allApplications = useSelector(
    (state) => state.admin.allApplications || [],
  );

  const allJobs = useSelector((state) => state.admin.allJobs || []);

  const [applicantFilter, setApplicantFilter] = useState("all");

  const [recruiterFilter, setRecruiterFilter] = useState("all");

  const [jobFilter, setJobFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const capitalize = (str) => {
    if (!str) return "";

    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const jobsMap = useMemo(() => {
    return allJobs.reduce((acc, job) => {
      acc[job.id] = job;
      return acc;
    }, {});
  }, [allJobs]);

  const filteredApplications = useMemo(() => {
    let updated = [...allApplications];

    if (applicantFilter !== "all") {
      updated = updated.filter((app) => app.applicantEmail === applicantFilter);
    }

    if (recruiterFilter !== "all") {
      updated = updated.filter((app) => app.recruiterEmail === recruiterFilter);
    }

    if (jobFilter !== "all") {
      updated = updated.filter((app) => app.jobTitle === jobFilter);
    }

    if (statusFilter !== "all") {
      updated = updated.filter((app) => app.status === statusFilter);
    }

    return updated;
  }, [
    allApplications,
    applicantFilter,
    recruiterFilter,
    jobFilter,
    statusFilter,
  ]);

  const uniqueApplicants = [
    ...new Set(allApplications.map((a) => a.applicantEmail).filter(Boolean)),
  ];

  const uniqueRecruiters = [
    ...new Set(allApplications.map((a) => a.recruiterEmail).filter(Boolean)),
  ];

  const uniqueJobs = [
    ...new Set(allApplications.map((a) => a.jobTitle).filter(Boolean)),
  ];

  const uniqueStatuses = [
    ...new Set(allApplications.map((a) => a.status).filter(Boolean)),
  ];

  return (
    <>
      <h1 className={classes.title}>Job Applications</h1>

      <div className={classes.filters}>
        <select
          value={applicantFilter}
          onChange={(e) => setApplicantFilter(e.target.value)}
        >
          <option value="all">All Applicants</option>

          {uniqueApplicants.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>

        <select
          value={recruiterFilter}
          onChange={(e) => setRecruiterFilter(e.target.value)}
        >
          <option value="all">All Recruiters</option>

          {uniqueRecruiters.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>

        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
        >
          <option value="all">All Jobs</option>

          {uniqueJobs.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>

          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {filteredApplications.length === 0 && (
        <p className={classes.empty}>No applications match selected filters</p>
      )}

      <div className={classes.applicationGrid}>
        {filteredApplications.map((app) => {
          const relatedJob = jobsMap[app.jobId];

          const recruitmentClosed = relatedJob?.jobOpeningStatus === "closed";

          return (
            <div
              key={app.id}
              className={`${classes.applicationCard} ${
                recruitmentClosed
                  ? classes.cardClosed
                  : classes[`card${capitalize(app.status)}`] || ""
              }`}
            >
              <div className={classes.badgeContainer}>
                <span
                  className={`${classes.inlineBadge}
      ${classes[`badge${capitalize(app.status)}`]}`}
                >
                  {capitalize(app.status)}
                </span>

                {recruitmentClosed && (
                  <span
                    className={`${classes.inlineBadge} ${classes.closedBadge}`}
                  >
                    Recruitment Closed
                  </span>
                )}
              </div>

              <div className={classes.row}>
                <strong>Applicant:</strong> {app.applicantEmail || "Unknown"}
              </div>

              <div className={classes.row}>
                <strong>Job Title:</strong> {app.jobTitle || "Unknown"}
              </div>

              <div className={classes.row}>
                <strong>Recruiter:</strong> {app.recruiterEmail || "Unknown"}
              </div>

              <div className={classes.row}>
                <strong>Applied On:</strong>{" "}
                {app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString()
                  : "-"}
              </div>

              {app.resumeUrl && (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={classes.resumeBtn}
                >
                  View Resume
                </a>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Applications;
