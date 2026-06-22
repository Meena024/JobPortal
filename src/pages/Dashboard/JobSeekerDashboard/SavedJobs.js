import { useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { unsaveJob } from "../../../store/jobSeekerActions";

import JobApply from "./JobApply";

import classes from "../../../Styling/Pages/JobSeekerDashboard/AvailableJobs.module.css";

const SavedJobs = () => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.userId);

  const savedJobs = useSelector((state) => state.jobs.savedJobs || {});

  const availableJobs = useSelector((state) => state.jobs.availableJobs || []);

  const [titleFilter, setTitleFilter] = useState("all");

  const [companyFilter, setCompanyFilter] = useState("all");

  const [locationFilter, setLocationFilter] = useState("all");

  const [salaryFilter, setSalaryFilter] = useState("all");

  const savedJobsList = useMemo(() => {
    return availableJobs
      .filter((job) => savedJobs[job.id])
      .filter((job) => job.jobOpeningStatus !== "closed")
      .map((job) => ({
        jobId: job.id,

        userId: job.userId,

        title: job.title,

        companyName: job.companyName,

        location: job.location,

        description: job.description,

        salary: job.salary,

        jobExists: true,
      }));
  }, [availableJobs, savedJobs]);

  const filteredSavedJobs = useMemo(() => {
    let updated = [...savedJobsList];

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

        if (salaryFilter === "0-5") {
          return salary <= 500000;
        }

        if (salaryFilter === "5-10") {
          return salary > 500000 && salary <= 1000000;
        }

        if (salaryFilter === "10+") {
          return salary > 1000000;
        }

        return true;
      });
    }

    return updated;
  }, [savedJobsList, titleFilter, companyFilter, locationFilter, salaryFilter]);

  const uniqueTitles = [...new Set(savedJobsList.map((job) => job.title))];

  const uniqueCompanies = [
    ...new Set(savedJobsList.map((job) => job.companyName)),
  ];

  const uniqueLocations = [
    ...new Set(savedJobsList.map((job) => job.location)),
  ];

  const removeSavedJobHandler = async (jobId) => {
    try {
      await dispatch(unsaveJob(userId, jobId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={classes.headerRow}>
        <h1>Saved Jobs</h1>

        <div className={classes.filters}>
          <select
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          >
            <option value="all">All Titles</option>

            {uniqueTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="all">All Companies</option>

            {uniqueCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>

            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
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
        </div>
      </div>

      {filteredSavedJobs.length === 0 && (
        <p className={classes.infoMessage}>
          No saved jobs match selected filters
        </p>
      )}

      <div className={classes.grid}>
        {filteredSavedJobs.map((job) => (
          <div key={job.jobId} className={classes.card}>
            <div className={classes.titleRow}>
              <h3>
                <strong>{job.title}</strong>
              </h3>

              <span
                className={classes.bookmarkIcon}
                onClick={() => removeSavedJobHandler(job.jobId)}
              >
                ★
              </span>
            </div>
            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Company:</span>{" "}
              {job.companyName}
            </div>
            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Location:</span>{" "}
              {job.location}
            </div>
            <p className={classes.description}>{job.description}</p>
            <div className={classes.salary}>₹ {job.salary} / Year</div>

            <JobApply jobId={job.jobId} recruiterId={job.userId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
