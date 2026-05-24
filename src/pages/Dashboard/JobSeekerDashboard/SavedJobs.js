import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchSavedJobs, unsaveJob } from "../../../store/jobSeekerActions";

import { dbApi } from "../../../services/dbApi";

import JobApply from "./JobApply";

import classes from "../../../Styling/Pages/JobSeekerDashboard/AvailableJobs.module.css";

const SavedJobs = () => {
  const dispatch = useDispatch();

  const [savedJobsList, setSavedJobsList] = useState([]);

  const [filteredSavedJobs, setFilteredSavedJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [titleFilter, setTitleFilter] = useState("all");

  const [companyFilter, setCompanyFilter] = useState("all");

  const [locationFilter, setLocationFilter] = useState("all");

  const [salaryFilter, setSalaryFilter] = useState("all");

  const userId = useSelector((state) => state.auth.userId);

  const savedJobs = useSelector((state) => state.jobs?.savedJobs || {});

  useEffect(() => {
    if (!userId) return;

    dispatch(fetchSavedJobs(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        setLoading(true);

        const jobsData = await dbApi.get("jobs");

        if (!jobsData) {
          setSavedJobsList([]);

          setFilteredSavedJobs([]);

          return;
        }

        const flattenedJobs = {};

        Object.entries(jobsData).forEach(([_, recruiterJobs]) => {
          Object.entries(recruiterJobs).forEach(([jobId, job]) => {
            flattenedJobs[jobId] = job;
          });
        });

        const arr = Object.keys(savedJobs || {})
          .map((jobId) => {
            const job = flattenedJobs[jobId];

            if (job && job.jobOpeningStatus === "closed") {
              return null;
            }

            return {
              jobId,

              userId: job?.userId,

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

    loadSavedJobs();
  }, [savedJobs]);

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

    setFilteredSavedJobs(updated);
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

      setSavedJobsList((prev) => prev.filter((job) => job.jobId !== jobId));
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
        </div>
      </div>

      {loading && <p className={classes.infoMessage}>Loading saved jobs...</p>}

      {!loading && filteredSavedJobs.length === 0 && (
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

            {job.jobExists && (
              <JobApply jobId={job.jobId} recruiterId={job.userId} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
