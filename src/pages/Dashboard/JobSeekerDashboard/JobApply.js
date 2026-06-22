import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { dbApi } from "../../../services/dbApi";
import { fetchAppliedJobs } from "../../../store/jobSeekerActions";
import classes from "../../../Styling/Pages/JobSeekerDashboard/JobApply.module.css";

const JobApply = ({ jobId, recruiterId, recruiterEmail, jobTitle }) => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.userId);
  const userEmail = useSelector((state) => state.auth.emailId);
  const resumes = useSelector((state) => state.jobs?.resumes || []);
  const appliedJobs = useSelector((state) => state.jobs?.appliedJobs || []);

  const [loading, setLoading] = useState(false);

  const [selectedResume, setSelectedResume] = useState(
    resumes.length > 0 ? resumes[0].id : "",
  );

  const alreadyApplied = appliedJobs.some(
    (application) => application.jobId === jobId,
  );

  const applyHandler = async () => {
    if (!selectedResume) {
      alert("Select resume first");

      return;
    }

    if (!recruiterId) {
      alert("Recruiter ID missing");

      return;
    }

    if (loading || alreadyApplied) return;

    try {
      setLoading(true);

      const selectedResumeData = resumes.find(
        (resume) => resume.id === selectedResume,
      );

      if (!selectedResumeData) {
        alert("Invalid resume selected");

        return;
      }

      const application = {
        jobId,
        recruiterId,
        recruiterEmail,
        jobTitle,
        applicantId: userId,
        applicantEmail: userEmail,
        resumeId: selectedResumeData.id,
        resumeUrl: selectedResumeData.resumeUrl,
        status: "pending",
        appliedAt: new Date().toISOString(),
      };

      await dbApi.post(`applications/${recruiterId}`, application);
      await dispatch(fetchAppliedJobs(userId));
    } catch (err) {
      console.error(err);
      alert("Application failed");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <button className={classes.disabledBtn} disabled>
        Login to Apply
      </button>
    );
  }

  if (alreadyApplied) {
    return (
      <button className={classes.appliedBtn} disabled>
        Applied ✓
      </button>
    );
  }

  if (resumes.length === 0) {
    return (
      <button className={classes.disabledBtn} disabled>
        Add Resume First
      </button>
    );
  }

  return (
    <div className={classes.wrapper}>
      <select
        className={classes.resumeDropdown}
        value={selectedResume}
        disabled={loading}
        onChange={(e) => setSelectedResume(e.target.value)}
      >
        {resumes.map((resume) => (
          <option key={resume.id} value={resume.id}>
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
