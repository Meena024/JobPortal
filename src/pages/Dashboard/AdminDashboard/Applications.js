import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/AdminDashboard/Applications.module.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);

  const [filteredApplications, setFilteredApplications] = useState([]);

  const [applicantFilter, setApplicantFilter] = useState("all");

  const [recruiterFilter, setRecruiterFilter] = useState("all");

  const [jobFilter, setJobFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  /*
    HELPER FUNCTION
  */

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  /*
    FETCH APPLICATIONS
  */

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsData = await dbApi.get("applications");

        const jobsData = await dbApi.get("jobs");

        const usersData = await dbApi.get("users");

        if (!applicationsData) return;

        const enrichedApplications = Object.entries(applicationsData).map(
          ([id, app]) => {
            const job = jobsData?.[app.jobId];

            return {
              id,
              ...app,

              jobTitle: job?.title || "Unknown Job",

              applicantEmail:
                usersData?.[app.userId]?.profile?.email || "Unknown User",

              recruiterEmail: job?.recruiterEmail || "Unknown Recruiter",
            };
          },
        );

        setApplications(enrichedApplications);

        setFilteredApplications(enrichedApplications);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplications();
  }, []);

  /*
    APPLY FILTERS
  */

  useEffect(() => {
    let updated = [...applications];

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

    setFilteredApplications(updated);
  }, [applications, applicantFilter, recruiterFilter, jobFilter, statusFilter]);

  /*
    UNIQUE FILTER VALUES
  */

  const uniqueApplicants = [
    ...new Set(applications.map((a) => a.applicantEmail)),
  ];

  const uniqueRecruiters = [
    ...new Set(applications.map((a) => a.recruiterEmail)),
  ];

  const uniqueJobs = [...new Set(applications.map((a) => a.jobTitle))];

  const uniqueStatuses = [...new Set(applications.map((a) => a.status))];

  return (
    <>
      <h1 className={classes.title}>Job Applications</h1>

      {/* FILTER BAR */}

      <div className={classes.filters}>
        <select
          value={applicantFilter}
          onChange={(e) => setApplicantFilter(e.target.value)}
        >
          <option value="all">All Applicants</option>

          {uniqueApplicants.map((email) => (
            <option key={email}>{email}</option>
          ))}
        </select>

        <select
          value={recruiterFilter}
          onChange={(e) => setRecruiterFilter(e.target.value)}
        >
          <option value="all">All Recruiters</option>

          {uniqueRecruiters.map((email) => (
            <option key={email}>{email}</option>
          ))}
        </select>

        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
        >
          <option value="all">All Jobs</option>

          {uniqueJobs.map((title) => (
            <option key={title}>{title}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>

          {uniqueStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* EMPTY STATE */}

      {filteredApplications.length === 0 && (
        <p className={classes.empty}>No applications match selected filters</p>
      )}

      {/* GRID */}

      <div className={classes.applicationGrid}>
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className={`${classes.applicationCard} ${
              classes[`card${capitalize(app.status)}`]
            }`}
          >
            {/* STATUS BADGE */}

            {app.status && (
              <span
                className={`${classes.statusBadge} ${
                  classes[`badge${capitalize(app.status)}`]
                }`}
              >
                {app.status}
              </span>
            )}

            <div className={classes.row}>
              <strong>Applicant:</strong> {app.applicantEmail}
            </div>

            <div className={classes.row}>
              <strong>Job Title:</strong> {app.jobTitle}
            </div>

            <div className={classes.row}>
              <strong>Recruiter:</strong> {app.recruiterEmail}
            </div>

            <div className={classes.row}>
              <strong>Applied On:</strong>{" "}
              {new Date(app.appliedAt).toLocaleDateString()}
            </div>

            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={classes.resumeBtn}
            >
              View Resume
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default Applications;
