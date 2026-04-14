import { useEffect, useState } from "react";

import classes from "../../Styling/Pages/RecruitersDashboard.module.css";

import { dbApi } from "../../services/dbApi";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await dbApi.get("jobs");

        if (!data) return;

        const jobsArray = Object.entries(data)
          .map(([id, value]) => ({
            id,
            ...value,
          }))
          .filter((job) => job.recruiterId === userId);

        setJobs(jobsArray);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, [userId]);

  return (
    <div className={classes.dashboard}>
      {/* SIDEBAR */}

      <aside className={classes.sidebar}>
        <h2>Recruiter Panel</h2>

        <button>+ Create Job</button>

        <button>My Jobs</button>
      </aside>

      {/* MAIN CONTENT */}

      <main className={classes.content}>
        <h1>My Job Listings</h1>

        {/* JOB LIST */}

        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          <div className={classes.jobGrid}>
            {jobs.map((job) => (
              <div key={job.id} className={classes.jobCard}>
                <h3>{job.title}</h3>

                <p>{job.company}</p>

                <p>{job.location}</p>

                <div className={classes.cardBtns}>
                  <button>Edit</button>

                  <button>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecruiterDashboard;
