import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";
import JobApply from "./JobApply";

import classes from "../../../Styling/Pages/JobSeekerDashboard/AvailableJobs.module.css";

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [savedJobs, setSavedJobs] = useState({});

  const [loading, setLoading] = useState(true);

  const [locationFilter, setLocationFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");

  const userId = localStorage.getItem("userId");

  /*
    FETCH JOBS + SAVED JOBS
  */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await dbApi.get("jobs");

        const savedJobsData = await dbApi.get("savedJobs");

        if (!jobsData) {
          setJobs([]);
          return;
        }

        const approvedJobs = Object.entries(jobsData)
          .map(([id, value]) => ({
            id,
            ...value,
          }))
          .filter(
            (job) =>
              job.status === "approved" &&
              (job.jobOpeningStatus || "open") === "open",
          );
        setJobs(approvedJobs);
        setFilteredJobs(approvedJobs);

        /*
          LOAD USER SAVED JOBS
        */

        const userSaved = Object.entries(savedJobsData || {})
          .filter(([_, value]) => value.userId === userId)
          .reduce((acc, [id, value]) => {
            acc[value.jobId] = id;
            return acc;
          }, {});

        setSavedJobs(userSaved);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userId]);

  /*
    MULTI FILTER SUPPORT
  */

  useEffect(() => {
    let updatedJobs = [...jobs];

    if (locationFilter !== "all") {
      updatedJobs = updatedJobs.filter(
        (job) => job.location === locationFilter,
      );
    }

    if (salaryFilter !== "all") {
      updatedJobs = updatedJobs.filter((job) => {
        const salary = Number(job.salary);

        if (salaryFilter === "0-5") return salary <= 500000;

        if (salaryFilter === "5-10")
          return salary > 500000 && salary <= 1000000;

        if (salaryFilter === "10+") return salary > 1000000;

        return true;
      });
    }

    setFilteredJobs(updatedJobs);
  }, [locationFilter, salaryFilter, jobs]);

  /*
    UNIQUE LOCATIONS
  */

  const uniqueLocations = [...new Set(jobs.map((job) => job.location))];

  /*
    SAVE / UNSAVE JOB
  */

  const toggleSaveJob = async (jobId) => {
    try {
      /*
      REMOVE SAVED JOB
    */

      if (savedJobs[jobId]) {
        await dbApi.remove(`savedJobs/${savedJobs[jobId]}`);

        setSavedJobs((prev) => {
          const updated = { ...prev };
          delete updated[jobId];
          return updated;
        });
      } else {
        /*
      SAVE JOB
    */
        const newId = Date.now().toString();

        await dbApi.patch(`savedJobs/${newId}`, {
          userId,
          jobId,
        });

        setSavedJobs((prev) => ({
          ...prev,
          [jobId]: newId,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* HEADER + FILTERS */}

      <div className={classes.headerRow}>
        <h1>Available Jobs</h1>

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

      {loading && <p className={classes.infoMessage}>Loading jobs...</p>}

      {/* EMPTY */}

      {!loading && filteredJobs.length === 0 && (
        <p className={classes.infoMessage}>No jobs match selected filters</p>
      )}

      {/* GRID */}

      <div className={classes.grid}>
        {filteredJobs.map((job) => (
          <div key={job.id} className={classes.card}>
            {/* TITLE + BOOKMARK */}

            <div className={classes.titleRow}>
              <h3>
                <strong>{job.title}</strong>
              </h3>

              <span
                className={classes.bookmarkIcon}
                onClick={() => toggleSaveJob(job.id)}
              >
                {savedJobs[job.id] ? "★" : "☆"}
              </span>
            </div>

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

            <JobApply jobId={job.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableJobs;
