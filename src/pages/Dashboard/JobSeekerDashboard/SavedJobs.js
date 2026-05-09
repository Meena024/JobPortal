import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";
import JobApply from "./JobApply";

import classes from "../../../Styling/Pages/JobSeekerDashboard/AvailableJobs.module.css";

const SavedJobs = () => {
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [filteredSavedJobs, setFilteredSavedJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [titleFilter, setTitleFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");

  const [locationFilter, setLocationFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const savedJobsData = await dbApi.get("savedJobs");
        const jobsData = await dbApi.get("jobs");

        if (!savedJobsData) {
          setSavedJobsList([]);
          return;
        }

        const arr = Object.entries(savedJobsData)
          .map(([id, value]) => ({
            id,
            ...value,
          }))
          .filter((item) => item.userId === userId)
          .map((item) => {
            const job = jobsData?.[item.jobId];

            if (job?.jobOpeningStatus === "closed") return null;

            return {
              savedId: item.id,
              jobId: item.jobId,

              title: job?.title || "Job removed",
              companyName: job?.companyName || "Unknown company",

              location: job?.location || "-",

              description:
                job?.description || "This job is no longer available.",

              salary: job?.salary || "-",

              jobExists: !!job,
            };
          })
          .filter(Boolean);

        setSavedJobsList(arr);
        setFilteredSavedJobs(arr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [userId]);

  /*
    APPLY FILTERS (PARALLEL)
  */

  useEffect(() => {
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

        if (salaryFilter === "0-5") return salary <= 500000;

        if (salaryFilter === "5-10")
          return salary > 500000 && salary <= 1000000;

        if (salaryFilter === "10+") return salary > 1000000;

        return true;
      });
    }

    setFilteredSavedJobs(updated);
  }, [savedJobsList, titleFilter, companyFilter, locationFilter, salaryFilter]);
  const uniqueTitles = [...new Set(savedJobsList.map((j) => j.title))];

  const uniqueCompanies = [...new Set(savedJobsList.map((j) => j.companyName))];

  const uniqueLocations = [...new Set(savedJobsList.map((j) => j.location))];

  const removeSavedJob = async (savedId) => {
    try {
      await dbApi.remove(`savedJobs/${savedId}`);

      setSavedJobsList((prev) => prev.filter((job) => job.savedId !== savedId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* HEADER + FILTERS */}

      <div className={classes.headerRow}>
        <h1>Saved Jobs</h1>

        <div className={classes.filters}>
          {/* TITLE FILTER */}
          <select
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          >
            <option value="all">All Titles</option>
            {uniqueTitles.map((title) => (
              <option key={title}>{title}</option>
            ))}
          </select>

          {/* COMPANY FILTER */}
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="all">All Companies</option>
            {uniqueCompanies.map((company) => (
              <option key={company}>{company}</option>
            ))}
          </select>

          {/* LOCATION FILTER */}

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>

            {uniqueLocations.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </select>

          {/* SALARY FILTER */}

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

      {/* LOADING */}

      {loading && <p className={classes.infoMessage}>Loading saved jobs...</p>}

      {/* EMPTY */}

      {!loading && filteredSavedJobs.length === 0 && (
        <p className={classes.infoMessage}>
          No saved jobs match selected filters
        </p>
      )}

      <div className={classes.grid}>
        {filteredSavedJobs.map((job) => (
          <div key={job.savedId} className={classes.card}>
            <div className={classes.titleRow}>
              <h3>
                <strong>{job.title}</strong>
              </h3>
              <span
                className={classes.bookmarkIcon}
                onClick={() => removeSavedJob(job.savedId)}
              >
                ★
              </span>
            </div>

            {!job.jobExists && (
              <span className={classes.removedBadge}>
                Job no longer available
              </span>
            )}

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

            {job.jobExists && <JobApply jobId={job.jobId} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
