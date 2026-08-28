import JobApply from "../../components/JobApply";

import classes from "./AvailableJobCard.module.css";

const AvailableJobCard = ({ job, isSaved, onToggleSave }) => {
  return (
    <article className={`card card-body-sm ${classes.card}`}>
      {/* =================================================
          HEADER
      ================================================= */}

      <header className={classes.header}>
        <div className={classes.heading}>
          <h3 className={classes.title}>{job.title}</h3>

          <p className={classes.company}>{job.companyName}</p>
        </div>

        <button
          type="button"
          className={classes.bookmarkButton}
          onClick={() => onToggleSave(job.id)}
          aria-label={isSaved ? "Remove job from saved jobs" : "Save job"}
        >
          {isSaved ? "★" : "☆"}
        </button>
      </header>

      {/* =================================================
          JOB META
      ================================================= */}

      <div className={classes.metaGrid}>
        <div className={classes.metaItem}>
          <span className={classes.metaLabel}>LOCATION</span>

          <span className={classes.metaValue}>{job.location || "-"}</span>
        </div>

        <div className={classes.metaItem}>
          <span className={classes.metaLabel}>PACKAGE</span>

          <span className={classes.package}>
            {job.package || "Not specified"}
          </span>
        </div>
      </div>

      {/* =================================================
          SKILLS
      ================================================= */}

      {job.skillsRequired && (
        <section className={classes.skillsSection}>
          <span className={classes.sectionLabel}>SKILLS REQUIRED</span>

          <div className={classes.skills}>{job.skillsRequired}</div>
        </section>
      )}

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      {job.description && (
        <p className={classes.description}>{job.description}</p>
      )}

      {/* =================================================
          APPLY
      ================================================= */}

      <div className={classes.apply}>
        <JobApply
          jobId={job.id}
          recruiterId={job.userId}
          recruiterEmail={job.recruiterEmail}
          recruiterCompany={job.companyName}
          jobTitle={job.title}
        />
      </div>
    </article>
  );
};

export default AvailableJobCard;
