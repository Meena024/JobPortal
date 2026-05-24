import { useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { dbApi } from "../../../services/dbApi";

import { adminActions } from "../../../store/adminSlice";

import classes from "../../../Styling/Pages/AdminDashboard/PendingJobs.module.css";

const PendingJobs = () => {
  const dispatch = useDispatch();

  /*
    REDUX STATE
  */

  const { allJobs } = useSelector((state) => state.admin);

  /*
    LOCAL STATE
  */

  const [rejectionReasons, setRejectionReasons] = useState({});

  /*
    FILTER ONLY PENDING JOBS
  */

  const jobs = useMemo(() => {
    return allJobs.filter((job) => job.status === "pending");
  }, [allJobs]);

  /*
    APPROVE JOB

    STORAGE:
    jobs/recruiterId/jobId
  */

  const approveHandler = async (job) => {
    try {
      await dbApi.patch(`jobs/${job.userId}/${job.id}`, {
        status: "approved",
      });

      dispatch(
        adminActions.updateJobStatus({
          id: job.id,
          status: "approved",
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  /*
    REJECT JOB
  */

  const rejectHandler = async (job) => {
    const reason = rejectionReasons[job.id];

    if (!reason || reason.trim() === "") {
      alert("Please enter rejection reason");
      return;
    }

    try {
      await dbApi.patch(`jobs/${job.userId}/${job.id}`, {
        status: "rejected",

        rejectionReason: reason,
      });

      dispatch(
        adminActions.updateJobStatus({
          id: job.id,

          status: "rejected",

          rejectionReason: reason,
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  /*
    REJECTION TEXT CHANGE
  */

  const changeHandler = (jobId, value) => {
    setRejectionReasons((prev) => ({
      ...prev,

      [jobId]: value,
    }));
  };

  return (
    <>
      <h1 className={classes.title}>Pending Job Approvals</h1>

      {jobs.length === 0 && <p className={classes.empty}>No pending jobs 🎉</p>}

      <div className={classes.jobGrid}>
        {jobs.map((job) => (
          <div key={job.id} className={classes.jobCard}>
            {/* HEADER */}

            <div className={classes.headerRow}>
              <div className={classes.jobTitle}>{job.title}</div>

              <span className={classes.status}>pending</span>
            </div>

            {/* META */}

            <div className={classes.metaRow}>
              <div className={classes.metaBlock}>
                <span>Company</span>

                <p>{job.companyName}</p>
              </div>

              <div className={classes.metaBlock}>
                <span>Location</span>

                <p>{job.location}</p>
              </div>
            </div>

            {/* SKILLS */}

            <div className={classes.skills}>{job.skillsRequired}</div>

            {/* DESCRIPTION */}

            <div className={classes.description}>{job.description}</div>

            {/* REJECTION INPUT */}

            <textarea
              placeholder="Reason for rejection..."
              className={classes.rejectionInput}
              value={rejectionReasons[job.id] || ""}
              onChange={(e) => changeHandler(job.id, e.target.value)}
            />

            {/* BUTTONS */}

            <div className={classes.cardBtns}>
              <button
                className={classes.approveBtn}
                onClick={() => approveHandler(job)}
              >
                Approve
              </button>

              <button
                className={classes.rejectBtn}
                onClick={() => rejectHandler(job)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PendingJobs;
