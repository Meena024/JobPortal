import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { saveJob, unsaveJob } from "../../../store/jobSeekerActions";
import { getUniqueValues } from "../../../utils/filterUtils";

import AvailableJobsFilters from "./components/AvailableJobsFilters";
import AvailableJobCard from "./components/AvailableJobCard";

import classes from "./AvailableJobs.module.css";

const DISPLAY_BATCH_SIZE = 25;

const AvailableJobs = () => {
  const dispatch = useDispatch();

  /* =====================================================
     FILTER STATE
  ===================================================== */

  const [locationFilter, setLocationFilter] = useState("all");

  const [packageFilter, setPackageFilter] = useState("all");

  /* =====================================================
     INFINITE SCROLL STATE
  ===================================================== */

  const [visibleCount, setVisibleCount] = useState(DISPLAY_BATCH_SIZE);

  const observerRef = useRef(null);

  /* =====================================================
     REDUX DATA
  ===================================================== */

  const jobs = useSelector((state) => state.jobs?.availableJobs || []);

  const savedJobs = useSelector((state) => state.jobs?.savedJobs || {});

  const userId = useSelector((state) => state.auth.userId);

  /* =====================================================
     FILTER OPTIONS
  ===================================================== */

  const uniqueLocations = useMemo(() => {
    return getUniqueValues(jobs, "location");
  }, [jobs]);

  /* =====================================================
     FILTERED JOBS
  ===================================================== */

  const filteredJobs = useMemo(() => {
    let updatedJobs = [...jobs];

    /* -------------------------------------------------
       LOCATION
    ------------------------------------------------- */

    if (locationFilter !== "all") {
      updatedJobs = updatedJobs.filter(
        (job) => job.location === locationFilter,
      );
    }

    /* -------------------------------------------------
       PACKAGE
    ------------------------------------------------- */

    if (packageFilter !== "all") {
      updatedJobs = updatedJobs.filter((job) => {
        const packageValue = job.package || "";

        const match = packageValue.match(/\d+(?:\.\d+)?/);

        if (!match) {
          return false;
        }

        const minPackage = Number(match[0]);

        if (packageFilter === "0-5") {
          return minPackage < 5;
        }

        if (packageFilter === "5-10") {
          return minPackage >= 5 && minPackage < 10;
        }

        if (packageFilter === "10+") {
          return minPackage >= 10;
        }

        return true;
      });
    }

    return updatedJobs;
  }, [jobs, locationFilter, packageFilter]);

  /* =====================================================
     RESET PAGINATION WHEN FILTER CHANGES
  ===================================================== */

  useEffect(() => {
    setVisibleCount(DISPLAY_BATCH_SIZE);
  }, [locationFilter, packageFilter]);

  /* =====================================================
     VISIBLE JOBS
  ===================================================== */

  const visibleJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  /* =====================================================
     CHECK WHETHER MORE JOBS EXIST
  ===================================================== */

  const hasMoreJobs = visibleCount < filteredJobs.length;

  /* =====================================================
     INFINITE SCROLL
  ===================================================== */

  useEffect(() => {
    if (!hasMoreJobs) {
      return;
    }

    const currentElement = observerRef.current;

    if (!currentElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting) {
          return;
        }

        setVisibleCount((previousCount) =>
          Math.min(previousCount + DISPLAY_BATCH_SIZE, filteredJobs.length),
        );
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      },
    );

    observer.observe(currentElement);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreJobs, filteredJobs.length]);

  /* =====================================================
     SAVE / UNSAVE
  ===================================================== */

  const toggleSaveJob = async (jobId) => {
    try {
      if (savedJobs[jobId]) {
        await dispatch(unsaveJob(userId, jobId));
      } else {
        await dispatch(saveJob(userId, jobId));
      }
    } catch (error) {
      console.error("Unable to update saved job:", error);
    }
  };

  /* =====================================================
     FILTER HANDLERS
  ===================================================== */

  const handleLocationChange = (value) => {
    setLocationFilter(value);
  };

  const handlePackageChange = (value) => {
    setPackageFilter(value);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className={classes.page}>
      {/* =================================================
          HEADER
      ================================================= */}

      <header className={classes.headerRow}>
        <h1 className="page-title">Available Jobs</h1>

        <AvailableJobsFilters
          locationFilter={locationFilter}
          packageFilter={packageFilter}
          locations={uniqueLocations}
          onLocationChange={handleLocationChange}
          onPackageChange={handlePackageChange}
        />
      </header>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filteredJobs.length === 0 && (
        <p className="text-muted">No jobs match selected filters</p>
      )}

      {/* =================================================
          JOB GRID
      ================================================= */}

      {filteredJobs.length > 0 && (
        <div className={`grid-3 ${classes.grid}`}>
          {visibleJobs.map((job) => (
            <AvailableJobCard
              key={job.id}
              job={job}
              isSaved={Boolean(savedJobs[job.id])}
              onToggleSave={toggleSaveJob}
            />
          ))}
        </div>
      )}

      {/* =================================================
          INFINITE SCROLL SENTINEL
      ================================================= */}

      {hasMoreJobs && (
        <div
          ref={observerRef}
          className={classes.loadMoreTrigger}
          aria-hidden="true"
        >
          Loading more jobs...
        </div>
      )}
    </section>
  );
};

export default AvailableJobs;
