import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { addResume, removeResume } from "../../../store/jobSeekerActions";

import classes from "../../../Styling/Pages/JobSeekerDashboard/MyResumes.module.css";

const MyResumes = () => {
  const dispatch = useDispatch();

  /*
    LOCAL STATE
  */

  const [resumeUrl, setResumeUrl] = useState("");

  const [resumeTitle, setResumeTitle] = useState("");

  /*
    USER
  */

  const userId = useSelector((state) => state.auth.userId);

  /*
    CONSTANTS
  */

  const MAX_RESUMES = 5;

  /*
    REDUX STATE
  */

  const resumes = useSelector((state) => state.jobs?.resumes || []);

  /*
    ADD RESUME
  */

  const addResumeHandler = async () => {
    /*
        VALIDATION
      */

    if (!resumeTitle.trim() || !resumeUrl.trim()) {
      alert("Resume title and URL required");

      return;
    }

    /*
        LIMIT CHECK
      */

    if (resumes.length >= MAX_RESUMES) {
      return;
    }

    try {
      const resumeData = {
        title: resumeTitle,

        resumeUrl,

        createdAt: new Date().toISOString(),
      };

      await dispatch(addResume(userId, resumeData));

      /*
          RESET INPUTS
        */

      setResumeTitle("");

      setResumeUrl("");
    } catch (err) {
      console.error(err);
    }
  };

  /*
    DELETE RESUME
  */

  const deleteResumeHandler = async (id) => {
    try {
      await dispatch(removeResume(userId, id));
    } catch (err) {
      console.error(err);
    }
  };

  /*
    LIMIT FLAG
  */

  const limitReached = resumes.length >= MAX_RESUMES;

  return (
    <div className={classes.wrapper}>
      <h1 className={classes.title}>My Resumes</h1>

      {/* ADD SECTION */}

      <div className={classes.addSection}>
        <input
          type="text"
          placeholder="Resume Title"
          value={resumeTitle}
          disabled={limitReached}
          onChange={(e) => setResumeTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Paste Resume URL"
          value={resumeUrl}
          disabled={limitReached}
          onChange={(e) => setResumeUrl(e.target.value)}
        />

        <button disabled={limitReached} onClick={addResumeHandler}>
          Add Resume
        </button>
      </div>

      {/* LIMIT MESSAGE */}

      {limitReached && (
        <p className={classes.limitMessage}>
          Resume limit reached (max 5). Delete one to upload a new resume.
          Previous job applications remain safe.
        </p>
      )}

      {/* EMPTY */}

      {resumes.length === 0 && (
        <p className={classes.emptyMessage}>No resumes added yet</p>
      )}

      {/* GRID */}

      <div className={classes.grid}>
        {resumes.map((resume) => (
          <div key={resume.id} className={classes.card}>
            {/* LEFT */}

            <div className={classes.left}>
              <div className={classes.resumeTitle}>{resume.title}</div>

              <div className={classes.resumeDate}>
                Added on {new Date(resume.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* RIGHT */}

            <div className={classes.cardActions}>
              <a href={resume.resumeUrl} target="_blank" rel="noreferrer">
                View Resume
              </a>

              <button onClick={() => deleteResumeHandler(resume.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyResumes;
