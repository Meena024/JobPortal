import { useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import classes from "../../../Styling/Pages/AdminDashboard/PendingJobs.module.css";

import { approveOrRejectJob } from "../../../store/adminActions";

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
    APPROVE/REJECT JOB
  */

  const jobApproveOrReject = (job, status) => {
    const reason = rejectionReasons[job.id];
    if (status === "rejected" && (!reason || reason.trim() === "")) {
      alert("Please enter rejection reason");
      return;
    }
    dispatch(approveOrRejectJob(job, status, reason));
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
                onClick={() => jobApproveOrReject(job, "approved")}
              >
                Approve
              </button>

              <button
                className={classes.rejectBtn}
                onClick={() => jobApproveOrReject(job, "rejected")}
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
