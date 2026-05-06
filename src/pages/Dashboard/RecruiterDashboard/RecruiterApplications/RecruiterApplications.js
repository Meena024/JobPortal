import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { dbApi } from "../../../../services/dbApi";
import { recruiterActions } from "../../../../store/recruiterSlice";

import ApplicationCard from "./ApplicationCard";

import styles from "../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/RecruiterApplications.module.css";

const RecruiterApplications = () => {
  const dispatch = useDispatch();

  const applications = useSelector(
    (state) => state.recruiter.recruiterApplications,
  );

  const userId = localStorage.getItem("userId");

  /*
  FILTER STATE
  */

  const [statusFilter, setStatusFilter] = useState("all");

  const [jobFilter, setJobFilter] = useState("all");

  const [filteredApplications, setFilteredApplications] = useState([]);

  /*
  FETCH APPLICATIONS
  */

  useEffect(() => {
    const fetchApplications = async () => {
      const jobsData = await dbApi.get("jobs");

      const usersData = await dbApi.get("users");

      const applicationsData = await dbApi.get("applications");

      if (!jobsData || !applicationsData) return;

      const recruiterJobs = Object.entries(jobsData)
        .filter(([_, job]) => job.recruiterId === userId)
        .reduce((acc, [id, value]) => {
          acc[id] = value;
          return acc;
        }, {});

      const enrichedApplications = Object.entries(applicationsData)
        .map(([id, app]) => {
          if (!recruiterJobs[app.jobId]) return null;

          return {
            id,
            ...app,
            jobTitle: recruiterJobs[app.jobId]?.title,

            applicantEmail:
              usersData?.[app.userId]?.profile?.email || "Unknown",
          };
        })
        .filter(Boolean);

      dispatch(recruiterActions.setRecruiterApplications(enrichedApplications));
    };

    fetchApplications();
  }, [dispatch, userId]);

  /*
  UNIQUE JOB TITLE LIST (FOR FILTER DROPDOWN)
  */

  const jobTitles = [
    "all",
    ...new Set(applications.map((app) => app.jobTitle)),
  ];

  /*
  APPLY FILTERS
  */

  useEffect(() => {
    let updated = [...applications];

    if (statusFilter !== "all") {
      updated = updated.filter((app) => app.status === statusFilter);
    }

    if (jobFilter !== "all") {
      updated = updated.filter((app) => app.jobTitle === jobFilter);
    }

    setFilteredApplications(updated);
  }, [statusFilter, jobFilter, applications]);

  return (
    <div className={styles.wrapper}>
      {/* HEADER + FILTER */}

      <div className={styles.headerRow}>
        <h2 className={styles.title}>Applications Received</h2>

        <div className={styles.filters}>
          {/* STATUS FILTER */}

          <select
            className={styles.filterDropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>

            <option value="pending">Pending</option>

            <option value="reviewed">Reviewed</option>

            <option value="shortlisted">Shortlisted</option>

            <option value="selected">Selected</option>

            <option value="rejected">Rejected</option>
          </select>

          {/* JOB TITLE FILTER */}

          <select
            className={styles.filterDropdown}
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            {jobTitles.map((title) => (
              <option key={title} value={title}>
                {title === "all" ? "All Jobs" : title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* EMPTY STATE */}

      {filteredApplications.length === 0 && (
        <p className={styles.info}>No applications match selected filter</p>
      )}

      {/* GRID */}

      <div className={styles.grid}>
        {filteredApplications.map((app) => (
          <ApplicationCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
};

export default RecruiterApplications;
