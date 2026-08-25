import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDelete } from "react-icons/md";

import { addResume, removeResume } from "../../../store/jobSeekerActions";

import classes from "./MyResumes.module.css";

const MyResumes = () => {
  const dispatch = useDispatch();

  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const userId = useSelector((state) => state.auth.userId);
  const resumes = useSelector((state) => state.jobs?.resumes || []);

  const MAX_RESUMES = 5;

  const addResumeHandler = async () => {
    if (!resumeTitle.trim() || !resumeUrl.trim()) {
      alert("Resume title and URL required");
      return;
    }

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

      setResumeTitle("");
      setResumeUrl("");
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteResumeHandler = async (id) => {
    try {
      await dispatch(removeResume(userId, id));
    } catch (err) {
      console.error(err);
    }
  };

  const limitReached = resumes.length >= MAX_RESUMES;

  return (
    <div className={classes.wrapper}>
      {/* PAGE HEADER */}

      <div className={classes.header}>
        <h1 className="page-title">My Resumes</h1>

        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={() => setShowAddForm((prev) => !prev)}
          disabled={limitReached}
        >
          {showAddForm ? "− Cancel" : "+ Add Resume"}
        </button>
      </div>

      {/* ADD FORM */}

      {showAddForm && !limitReached && (
        <div className={`${classes.addSection} card card-body-sm`}>
          <input
            className="input"
            type="text"
            placeholder="Resume Title"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
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

      {/* LIMIT MESSAGE */}

      {limitReached && (
        <p className={`${classes.limitMessage} text-small`}>
          Maximum 5 resumes reached. Delete a resume to add another.
        </p>
      )}

      {/* EMPTY */}

      {resumes.length === 0 && (
        <p className={`${classes.emptyMessage} text-muted`}>
          No resumes added yet
        </p>
      )}

      {/* ALL RESUMES — SINGLE CARD */}

      {resumes.length > 0 && (
        <div className={`${classes.resumeList} card`}>
          {resumes.map((resume, index) => (
            <div
              key={resume.id}
              className={`${classes.resumeRow} ${
                index === resumes.length - 1 ? classes.lastRow : ""
              }`}
            >
              <a
                href={resume.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className={classes.resumeInfo}
              >
                <span className={classes.resumeTitle}>{resume.title}</span>

                <span className={`${classes.resumeDate} text-small`}>
                  Added on {new Date(resume.createdAt).toLocaleDateString()}
                </span>
              </a>

              <button
                type="button"
                className={classes.deleteButton}
                onClick={() => deleteResumeHandler(resume.id)}
                aria-label={`Delete ${resume.title}`}
              >
                <MdOutlineDelete />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResumes;
