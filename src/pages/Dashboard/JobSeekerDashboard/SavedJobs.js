import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";
import JobApply from "./JobApply";

import classes from "../../../Styling/Pages/JobSeekerDashboard/AvailableJobs.module.css";

const SavedJobs = () => {
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [filteredSavedJobs, setFilteredSavedJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [locationFilter, setLocationFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");

  const userId = localStorage.getItem("userId");

  /*
    FETCH SAVED JOBS
  */

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
          });

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
  }, [locationFilter, salaryFilter, savedJobsList]);

  /*
    UNIQUE LOCATIONS
  */

  const uniqueLocations = [
    ...new Set(savedJobsList.map((job) => job.location)),
  ];

  /*
    REMOVE SAVED JOB
  */

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

      {/* GRID */}

      <div className={classes.grid}>
        {filteredSavedJobs.map((job) => (
          <div key={job.savedId} className={classes.card}>
            {/* TITLE + REMOVE BOOKMARK */}

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

            {/* REMOVED JOB WARNING */}

            {!job.jobExists && (
              <span className={classes.removedBadge}>
                Job no longer available
              </span>
            )}

            {/* COMPANY */}

            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Company:</span>{" "}
              {job.companyName}
            </div>

            {/* LOCATION */}

            <div className={classes.metaRow}>
              <span className={classes.metaLabel}>Location:</span>{" "}
              {job.location}
            </div>

            {/* DESCRIPTION */}

            <p className={classes.description}>{job.description}</p>

            {/* SALARY */}

            <div className={classes.salary}>₹ {job.salary} / Year</div>

            {/* APPLY BUTTON */}

            {job.jobExists && <JobApply jobId={job.jobId} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
