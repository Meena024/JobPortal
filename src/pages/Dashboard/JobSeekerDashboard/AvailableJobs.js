import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchAvailableJobs,
  saveJob,
  unsaveJob,
} from "../../../store/jobSeekerActions";

import JobApply from "./JobApply";

import classes from "../../../Styling/Pages/JobSeekerDashboard/AvailableJobs.module.css";

const AvailableJobs = () => {
  const dispatch = useDispatch();

  const [filteredJobs, setFilteredJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [locationFilter, setLocationFilter] = useState("all");

  const [salaryFilter, setSalaryFilter] = useState("all");

  const jobs = useSelector((state) => state.jobs?.availableJobs || []);

  const savedJobs = useSelector((state) => state.jobs?.savedJobs || {});

  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);

        await dispatch(fetchAvailableJobs());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [dispatch]);

  /*
    APPLY FILTERS
  */

  useEffect(() => {
    let updatedJobs = [...jobs];

    /*
      LOCATION FILTER
    */

    if (locationFilter !== "all") {
      updatedJobs = updatedJobs.filter(
        (job) => job.location === locationFilter,
      );
    }

    /*
      SALARY FILTER
    */

    if (salaryFilter !== "all") {
      updatedJobs = updatedJobs.filter((job) => {
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

    setFilteredJobs(updatedJobs);
  }, [jobs, locationFilter, salaryFilter]);

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
          UNSAVE JOB
        */

      if (savedJobs[jobId]) {
        await dispatch(unsaveJob(userId, jobId));
      } else {
        /*
            SAVE JOB
          */

        await dispatch(saveJob(userId, jobId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* HEADER */}

      <div className={classes.headerRow}>
        <h1>Available Jobs</h1>

        <div className={classes.filters}>
          {/* LOCATION */}

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>

            {uniqueLocations.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </select>

          {/* SALARY */}

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
            {/* TITLE */}

            <div className={classes.titleRow}>
              <h3>
                <strong>{job.title}</strong>
              </h3>

              {/* BOOKMARK */}

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

            {/* APPLY */}

            <JobApply
              jobId={job.id}
              recruiterId={job.userId}
              recruiterEmail={job.recruiterEmail}
              jobTitle={job.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableJobs;
