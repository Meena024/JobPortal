import { useState } from "react";

import { dbApi } from "../../services/dbApi";

import classes from "../../Styling/Pages/Jobs/JobApply.module.css";

const JobApply = ({ jobId }) => {
  const [loading, setLoading] = useState(false);

  const [applied, setApplied] = useState(false);

  const [showInput, setShowInput] = useState(false);

  const [resumeUrl, setResumeUrl] = useState("");

  const userId = localStorage.getItem("userId");

  const applyHandler = async () => {
    if (!userId) {
      alert("Login required");

      return;
    }

    if (!resumeUrl) {
      alert("Please enter resume URL");

      return;
    }

    setLoading(true);

    try {
      const application = {
        jobId,

        userId,

        resumeUrl,

        status: "pending",

        appliedAt: new Date().toISOString(),
      };

      await dbApi.post("applications", application);

      setApplied(true);

      setShowInput(false);
    } catch (err) {
      console.error(err);

      alert("Application failed");
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <button className={classes.appliedBtn} disabled>
        Applied ✓
      </button>
    );
  }

  return (
    <div className={classes.wrapper}>
      {!showInput ? (
        <button className={classes.applyBtn} onClick={() => setShowInput(true)}>
          Apply Now
        </button>
      ) : (
        <div className={classes.inputBox}>
          <input
            type="text"
            placeholder="Paste Resume URL"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
          />

          <button onClick={applyHandler} disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      )}
    </div>
  );
};

export default JobApply;
