import { useEffect, useState } from "react";

import { dbApi } from "../../../services/dbApi";

import classes from "../../../Styling/Pages/JobSeekerDashboard/MyResumes.module.css";

const MyResumes = () => {
  const [resumes, setResumes] = useState([]);

  const [resumeUrl, setResumeUrl] = useState("");

  const [resumeTitle, setResumeTitle] = useState("");

  const userId = localStorage.getItem("userId");

  const MAX_RESUMES = 5;

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await dbApi.get(`users/${userId}/resumes`);

        if (!data) {
          setResumes([]);
          return;
        }

        const arr = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));

        setResumes(arr);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResumes();
  }, [userId]);

  const addResume = async () => {
    if (!resumeTitle.trim() || !resumeUrl.trim()) {
      alert("Resume title and URL required");
      return;
    }

    if (resumes.length >= MAX_RESUMES) return;

    try {
      const resume = {
        title: resumeTitle,
        resumeUrl,
        createdAt: new Date().toISOString(),
      };

      const response = await dbApi.post(`users/${userId}/resumes`, resume);

      setResumes((prev) => [
        ...prev,
        {
          id: response.name,
          ...resume,
        },
      ]);

      setResumeTitle("");
      setResumeUrl("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteResume = async (id) => {
    try {
      await dbApi.remove(`users/${userId}/resumes/${id}`);

      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const limitReached = resumes.length >= MAX_RESUMES;

  return (
    <div className={classes.wrapper}>
      <h1 className={classes.title}>My Resumes</h1>

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

        <button disabled={limitReached} onClick={addResume}>
          Add Resume
        </button>
      </div>

      {limitReached && (
        <p className={classes.limitMessage}>
          Resume limit reached (max 5). Delete one to upload a new resume.
          Previous job applications remain safe.
        </p>
      )}

      {resumes.length === 0 && (
        <p className={classes.emptyMessage}>No resumes added yet</p>
      )}

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

              <button onClick={() => deleteResume(resume.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyResumes;
