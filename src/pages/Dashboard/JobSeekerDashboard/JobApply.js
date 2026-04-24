import { useEffect, useState } from "react";
import { dbApi } from "../../../services/dbApi";
import classes from "../../../Styling/Pages/JobSeekerDashboard/JobApply.module.css";

const JobApply = ({ jobId }) => {
  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(false);

  const [checkingStatus, setCheckingStatus] = useState(true);

  const [applied, setApplied] = useState(false);

  const [resumes, setResumes] = useState([]);

  const [selectedResume, setSelectedResume] = useState("");

  /*
     FETCH USER RESUMES
  */
  useEffect(() => {
    const fetchResumes = async () => {
      if (!userId) return;

      const data = await dbApi.get(`users/${userId}/resumes`);

      if (!data) return;

      const resumeList = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      setResumes(resumeList);

      if (resumeList.length > 0) {
        setSelectedResume(resumeList[0].resumeUrl);
      }
    };

    fetchResumes();
  }, [userId]);

  /*
     CHECK IF USER ALREADY APPLIED
  */

  useEffect(() => {
    const checkApplication = async () => {
      if (!userId) return;

      try {
        const data = await dbApi.get("applications");

        if (!data) return;

        const alreadyApplied = Object.values(data).some(
          (app) => app.jobId === jobId && app.userId === userId,
        );

        setApplied(alreadyApplied);
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkApplication();
  }, [jobId, userId]);

  /*
     APPLY HANDLER
  */

  const applyHandler = async () => {
    if (!selectedResume) {
      alert("Select resume first");

      return;
    }

    setLoading(true);

    try {
      const application = {
        jobId,

        userId,

        resumeUrl: selectedResume,

        status: "pending",

        appliedAt: new Date().toISOString(),
      };

      await dbApi.post("applications", application);

      setApplied(true);
    } catch (err) {
      console.error(err);

      alert("Application failed");
    } finally {
      setLoading(false);
    }
  };

  /*
     UI STATES
  */

  if (!userId)
    return (
      <button className={classes.disabledBtn} disabled>
        Login to Apply
      </button>
    );

  if (checkingStatus)
    return (
      <button className={classes.disabledBtn} disabled>
        Checking status...
      </button>
    );

  if (applied)
    return (
      <button className={classes.appliedBtn} disabled>
        Applied ✓
      </button>
    );

  if (resumes.length === 0)
    return (
      <button className={classes.disabledBtn} disabled>
        Add Resume First
      </button>
    );

  return (
    <div className={classes.wrapper}>
      <select
        className={classes.resumeDropdown}
        value={selectedResume}
        disabled={loading}
        onChange={(e) => setSelectedResume(e.target.value)}
      >
        {resumes.map((resume) => (
          <option key={resume.id} value={resume.resumeUrl}>
            {resume.title}
          </option>
        ))}
      </select>

      <button
        className={classes.applyBtn}
        onClick={applyHandler}
        disabled={loading}
      >
        {loading ? "Applying..." : "Apply Now"}
      </button>
    </div>
  );
};

export default JobApply;
