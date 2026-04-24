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
      const data = await dbApi.get(`users/${userId}/resumes`);

      if (!data) return;

      const arr = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      setResumes(arr);
    };

    fetchResumes();
  }, [userId]);

  const addResume = async () => {
    if (!resumeTitle || !resumeUrl) {
      alert("Resume title and URL required");
      return;
    }

    if (resumes.length >= MAX_RESUMES) return;

    const resume = {
      title: resumeTitle,
      resumeUrl,
      createdAt: new Date().toISOString(),
    };

    const response = await dbApi.post(`users/${userId}/resumes`, resume);

    setResumes([
      ...resumes,
      {
        id: response.name,
        ...resume,
      },
    ]);

    setResumeTitle("");
    setResumeUrl("");
  };

  const deleteResume = async (id) => {
    await dbApi.remove(`users/${userId}/resumes/${id}`);

    setResumes(resumes.filter((r) => r.id !== id));
  };

  const limitReached = resumes.length >= MAX_RESUMES;

  return (
    <>
      <h1>My Resumes</h1>

      <div className={classes.addSection}>
        <input
          placeholder="Resume Title"
          value={resumeTitle}
          disabled={limitReached}
          onChange={(e) => setResumeTitle(e.target.value)}
        />

        <input
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

      <div className={classes.grid}>
        {resumes.map((resume) => (
          <div key={resume.id} className={classes.card}>
            <div className={classes.resumeTitle}>{resume.title}</div>

            <a href={resume.resumeUrl} target="_blank" rel="noreferrer">
              View Resume
            </a>

            <button onClick={() => deleteResume(resume.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyResumes;
