import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { jobSeekerActions } from "../../../store/jobSeekerSlice";

import ApplicationProcess from "../../components/ApplicationProcess/ApplicationProcess";

import ApplicationFilters from "./components/ApplicationFilters";
import ApplicationCard from "./components/ApplicationCard";

import styles from "./AppliedJobs.module.css";

const AppliedJobs = () => {
  const dispatch = useDispatch();

  const highlightedRef = useRef(null);

  /* =====================================================
     REDUX DATA
  ===================================================== */

  const jobsData = useSelector((state) => state.jobs.allJobs || []);

  const applications = useSelector((state) => state.jobs.appliedJobs || []);

  const highlightedApplicationId = useSelector(
    (state) => state.jobs.highlightedApplicationId,
  );

  /* =====================================================
     FILTER STATE
  ===================================================== */

  const [statusFilter, setStatusFilter] = useState("all");

  const [openingStatusFilter, setOpeningStatusFilter] = useState("all");

  /* =====================================================
     ENRICH APPLICATIONS
  ===================================================== */

  const enrichedApplications = useMemo(() => {
    const jobsMap = {};

    jobsData.forEach((job) => {
      jobsMap[job.id] = job;
    });

    return applications.map((app) => {
      const job = jobsMap[app.jobId];

      return {
        ...app,

        jobTitle: job?.title || "Job removed",

        companyName: job?.companyName || "Unknown company",

        description: job?.description || "This job is no longer available.",

        package: job?.package || "-",

        location: job?.location || "-",

        jobExists: Boolean(job),

        jobOpeningStatus: job?.jobOpeningStatus || "open",
      };
    });
  }, [applications, jobsData]);

  /* =====================================================
     FILTER APPLICATIONS
  ===================================================== */

  const filteredApplications = useMemo(() => {
    /*
      When an application is highlighted,
      temporarily show all applications so
      the highlighted application can be located.
    */

    if (highlightedApplicationId) {
      return enrichedApplications;
    }

    return enrichedApplications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) {
        return false;
      }

      if (
        openingStatusFilter !== "all" &&
        app.jobOpeningStatus !== openingStatusFilter
      ) {
        return false;
      }

      return true;
    });
  }, [
    enrichedApplications,
    statusFilter,
    openingStatusFilter,
    highlightedApplicationId,
  ]);

  /* =====================================================
     SCROLL TO HIGHLIGHTED APPLICATION
  ===================================================== */

  useEffect(() => {
    if (!highlightedApplicationId) {
      return;
    }

    const timer = setTimeout(() => {
      highlightedRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [highlightedApplicationId, filteredApplications.length]);

  /* =====================================================
     CLEAR HIGHLIGHT
  ===================================================== */

  useEffect(() => {
    if (!highlightedApplicationId) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(jobSeekerActions.clearHighlightedApplication());
    }, 4000);

    return () => clearTimeout(timer);
  }, [highlightedApplicationId, dispatch]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className={styles.wrapper}>
      <header className={styles.headerRow}>
        <h1 className={styles.title}>Applied Jobs</h1>

        <ApplicationFilters
          statusFilter={statusFilter}
          openingStatusFilter={openingStatusFilter}
          onStatusChange={setStatusFilter}
          onOpeningStatusChange={setOpeningStatusFilter}
        />
      </header>

      <ApplicationProcess />

      {filteredApplications.length === 0 ? (
        <p className={styles.infoMessage}>No applications found.</p>
      ) : (
        <div className={styles.list}>
          {filteredApplications.map((app) => {
            const isHighlighted = highlightedApplicationId === app.id;

            return (
              <ApplicationCard
                key={app.id}
                app={app}
                highlightedRef={isHighlighted ? highlightedRef : null}
                isHighlighted={isHighlighted}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AppliedJobs;
