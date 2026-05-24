import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recruiterActions } from "../../../store/recruiterSlice";
import {
  deleteRecruiterJob,
  closeRecruiterJob,
} from "../../../store/recruiterActions";

import classes from "../../../Styling/Pages/RecruiterDashboard/MyJobs.module.css";

const MyJobs = () => {
  const userId = useSelector((state) => state.auth.userId);

  const jobs = useSelector((state) => state.recruiter.recruiterJobs);

  const loading = useSelector((state) => state.recruiter.loading);

  const error = useSelector((state) => state.recruiter.error);

  const dispatch = useDispatch();

  /*
    FILTER STATE
  */

  const [filteredJobs, setFilteredJobs] = useState([]);

  const [titleFilter, setTitleFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openingStatusFilter, setOpeningStatusFilter] = useState("all");

  /*
    APPLY MULTIPLE FILTERS
  */

  useEffect(() => {
    let updated = [...jobs];

    if (titleFilter !== "all") {
      updated = updated.filter((job) => job.title === titleFilter);
    }

    if (companyFilter !== "all") {
      updated = updated.filter((job) => job.companyName === companyFilter);
    }

    if (locationFilter !== "all") {
      updated = updated.filter((job) => job.location === locationFilter);
    }

    if (salaryFilter !== "all") {
      updated = updated.filter((job) => {
        const salary = Number(job.salary);

        if (salaryFilter === "0-5") return salary <= 500000;

        if (salaryFilter === "5-10")
          return salary > 500000 && salary <= 1000000;

        if (salaryFilter === "10+") return salary > 1000000;

        return true;
      });
    }

    if (statusFilter !== "all") {
      updated = updated.filter((job) => job.status === statusFilter);
    }

    if (openingStatusFilter !== "all") {
      updated = updated.filter(
        (job) => (job.jobOpeningStatus || "open") === openingStatusFilter,
      );
    }

    setFilteredJobs(updated);
  }, [
    jobs,
    titleFilter,
    companyFilter,
    locationFilter,
    salaryFilter,
    statusFilter,
    openingStatusFilter,
  ]);

  /*
    UNIQUE FILTER VALUES
  */

  const uniqueTitles = [...new Set(jobs.map((j) => j.title))];

  const uniqueCompanies = [...new Set(jobs.map((j) => j.companyName))];

  const uniqueLocations = [...new Set(jobs.map((j) => j.location))];

  /*
    DELETE JOB
  */

  const deleteHandler = async (jobId) => {
    await dispatch(deleteRecruiterJob(userId, jobId));
  };

  /*
    EDIT JOB
  */

  const editHandler = (job) => {
    dispatch(recruiterActions.setEditingJob(job));

    dispatch(recruiterActions.setActiveView("create"));
  };

  /*
    CLOSE JOB
  */

  const closeJobHandler = async (jobId) => {
    await dispatch(closeRecruiterJob(userId, jobId));
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>My Job Listings</h1>

      {/* FILTER ROW */}

      <div className={classes.filters}>
        <select
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        >
          <option value="all">All Titles</option>

          {uniqueTitles.map((title) => (
            <option key={title}>{title}</option>
          ))}
        </select>

        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
        >
          <option value="all">All Companies</option>

          {uniqueCompanies.map((company) => (
            <option key={company}>{company}</option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="all">All Locations</option>

          {uniqueLocations.map((loc) => (
            <option key={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={salaryFilter}
          onChange={(e) => setSalaryFilter(e.target.value)}
        >
          <option value="all">All Salaries</option>

          <option value="0-5">0 – 5 LPA</option>

          <option value="5-10">5 – 10 LPA</option>

          <option value="10+">10+ LPA</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={openingStatusFilter}
          onChange={(e) => setOpeningStatusFilter(e.target.value)}
        >
          <option value="all">All Openings</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* STATES */}

      {loading && <p className={classes.info}>Loading jobs...</p>}

      {error && <p className={classes.error}>{error}</p>}

      {!loading && filteredJobs.length === 0 && (
        <p className={classes.info}>No jobs match selected filters</p>
      )}

      <div className={classes.jobGrid}>
        {filteredJobs.map((job) => {
          const isLocked =
            job.status === "approved" || job.status === "rejected";

          const isClosed = job.jobOpeningStatus === "closed";

          return (
            <div key={job.id} className={classes.jobCard}>
              <div className={classes.headerRow}>
                <div className={classes.jobTitle}>{job.title}</div>

                <span className={`${classes.status} ${classes[job.status]}`}>
                  {job.status}
                </span>
              </div>

              <div className={classes.metaRow}>
                <div>
                  <span>Company</span>
                  <p>{job.companyName}</p>
                </div>

                <div>
                  <span>Location</span>
                  <p>{job.location}</p>
                </div>

                <div>
                  <span>Salary</span>
                  <p>₹ {job.salary}</p>
                </div>
              </div>

              <div className={classes.skills}>{job.skillsRequired}</div>

              <div className={classes.description}>{job.description}</div>

              {isClosed && (
                <div className={classes.metaCol}>
                  <span>Recruitment Status</span>
                  <p>Closed</p>
                </div>
              )}

              {job.status === "approved" && !isClosed && (
                <button
                  className={classes.closeBtn}
                  onClick={() => closeJobHandler(job.id)}
                >
                  End Recruitment
                </button>
              )}

              {!isLocked && (
                <div className={classes.cardBtns}>
                  <button onClick={() => editHandler(job)}>Edit</button>

                  <button
                    className={classes.deleteBtn}
                    onClick={() => deleteHandler(job.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyJobs;
