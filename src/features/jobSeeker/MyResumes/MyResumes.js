import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDelete } from "react-icons/md";

import { addResume, removeResume } from "../../../store/jobSeekerActions";

import classes from "./MyResumes.module.css";

const MAX_RESUMES = 5;

const MyResumes = () => {
  const dispatch = useDispatch();

  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const userId = useSelector((state) => state.auth.userId);
  const resumes = useSelector((state) => state.jobs?.resumes || []);

  const addResumeHandler = async () => {
    if (!resumeTitle.trim() || !resumeUrl.trim()) {
      window.alert("Resume title and URL are required.");
      return;
    }

    if (resumes.length >= MAX_RESUMES) {
      window.alert(
        "You can have a maximum of 5 resumes. Please remove an existing resume before adding another.",
      );
      return;
    }

    try {
      const resumeData = {
        title: resumeTitle.trim(),
        resumeUrl: resumeUrl.trim(),
        createdAt: new Date().toISOString(),
      };

      await dispatch(addResume(userId, resumeData));

      setResumeTitle("");
      setResumeUrl("");
      setShowAddForm(false);
    } catch (err) {
      console.error("Unable to add resume:", err);
    }
  };

  const deleteResumeHandler = async (id) => {
    try {
      await dispatch(removeResume(userId, id));
    } catch (err) {
      console.error("Unable to delete resume:", err);
    }
  };

  const resumeTitleChangeHandler = (event) => {
    const value = event.target.value;

    setResumeTitle(value.charAt(0).toUpperCase() + value.slice(1));
  };

  const limitReached = resumes.length >= MAX_RESUMES;

  return (
    <div className={classes.wrapper}>
      {/* PAGE HEADER */}

      <header className={classes.header}>
        <h1 className="page-title">My Resumes</h1>

        <div className={classes.headerActions}>
          <button
            type="button"
            className="btn btn--primary btn--small"
            onClick={() => setShowAddForm((prev) => !prev)}
            disabled={limitReached}
            title={
              limitReached
                ? "Remove a resume before adding another"
                : "Add a new resume"
            }
          >
            {showAddForm ? "− Cancel" : "+ Add Resume"}
          </button>
        </div>
      </header>

      {/* =================================================
          ADD FORM
      ================================================= */}

      {showAddForm && !limitReached && (
        <div className={`${classes.addSection} card card-body-sm`}>
          <input
            className="input"
            type="text"
            placeholder="Resume Title"
            value={resumeTitle}
            onChange={resumeTitleChangeHandler}
          />

          <input
            className="input"
            type="url"
            placeholder="Paste Resume URL"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
          />

          <button
            type="button"
            className="btn btn--primary"
            onClick={addResumeHandler}
          >
            Add
          </button>
        </div>
      )}

      {/* =================================================
          LIMIT MESSAGE
      ================================================= */}

      {limitReached && (
        <p className={classes.limitMessage}>
          You have reached the maximum of {MAX_RESUMES} resumes. Remove an
          existing resume to add another.
        </p>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {resumes.length === 0 && (
        <p className={classes.emptyMessage}>
          No resumes added yet. Add a resume to apply for jobs.
        </p>
      )}

      {/* =================================================
          RESUME LIST
      ================================================= */}

      {resumes.length > 0 && (
        <section className={`${classes.resumeList} card`}>
          {resumes.map((resume, index) => (
            <div
              key={resume.id}
              className={`${classes.resumeRow} ${
                index === resumes.length - 1 ? classes.lastRow : ""
              }`}
            >
              {/* RESUME INFORMATION */}

              <button
                type="button"
                className={classes.resumeInfo}
                onClick={() =>
                  window.open(resume.resumeUrl, "_blank", "noopener,noreferrer")
                }
              >
                <span className={classes.resumeTitle}>{resume.title}</span>

                <span className={classes.resumeDate}>
                  Added on {new Date(resume.createdAt).toLocaleDateString()}
                </span>
              </button>

              {/* DELETE */}

              <button
                type="button"
                className={classes.deleteButton}
                onClick={() => deleteResumeHandler(resume.id)}
                aria-label={`Delete ${resume.title}`}
                title={`Delete ${resume.title}`}
              >
                <MdOutlineDelete />
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default MyResumes;
