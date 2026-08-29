import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  createRecruiterJob,
  updateRecruiterJob,
} from "../../../store/recruiterActions";

import { recruiterActions } from "../../../store/recruiterSlice";
import { capitalizeFirstLetter } from "../../../utils/capitalizeUtils";

import styles from "./CreateJob.module.css";

const INITIAL_FORM = {
  title: "",
  companyName: "",
  package: "",
  location: "",
  skillsRequired: "",
  description: "",
};

const PACKAGE_OPTIONS = [
  "0 - 2 LPA",
  "2 - 4 LPA",
  "4 - 6 LPA",
  "6 - 8 LPA",
  "8 - 10 LPA",
  "10 - 12 LPA",
  "12 - 15 LPA",
  "15 - 20 LPA",
  "20+ LPA",
];

const CreateJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =====================================================
     AUTH
  ===================================================== */

  const userId = useSelector((state) => state.auth.userId);

  const recruiterEmail =
    useSelector((state) => state.auth.emailId) || "Unknown Recruiter";

  /* =====================================================
     EDITING JOB
  ===================================================== */

  const editingJob = useSelector((state) => state.recruiter.editingJob);

  /* =====================================================
     FORM STATE
  ===================================================== */

  const [form, setForm] = useState(INITIAL_FORM);

  const [submitting, setSubmitting] = useState(false);

  /* =====================================================
     SYNC FORM WITH EDITING MODE
  ===================================================== */

  useEffect(() => {
    if (editingJob) {
      setForm({
        title: editingJob.title || "",
        companyName: editingJob.companyName || "",
        package: editingJob.package || "",
        location: editingJob.location || "",
        skillsRequired: editingJob.skillsRequired || "",
        description: editingJob.description || "",
      });

      return;
    }

    setForm(INITIAL_FORM);
  }, [editingJob]);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    const formattedValue =
      name === "description" ? capitalizeFirstLetter(value) : value;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: formattedValue,
    }));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const jobData = {
        ...form,
        userId,
        recruiterEmail,
        jobOpeningStatus: "open",
        status: editingJob?.status || "pending",
        createdAt: editingJob?.createdAt || new Date().toISOString(),
      };

      if (editingJob) {
        await dispatch(updateRecruiterJob(userId, editingJob.id, jobData));
      } else {
        await dispatch(createRecruiterJob(userId, jobData));
      }

      dispatch(recruiterActions.setEditingJob(null));

      navigate("/recruiter/jobs");
    } catch (error) {
      console.error("Create/Update Job Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(editingJob);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h2 className="page-title">
            {isEditing ? "Update Job" : "Create Job"}
          </h2>

          <p className="page-subtitle">
            {isEditing
              ? "Update the details of your existing job posting."
              : "Create a new job posting with the required details."}
          </p>
        </div>
      </header>

      <form className={`card ${styles.formCard}`} onSubmit={handleSubmit}>
        {/* =================================================
            JOB DETAILS
        ================================================= */}

        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h3 className="section-title">Job Details</h3>

            <p className="section-subtitle">
              Provide the basic information about the position.
            </p>
          </div>

          <div className={styles.formGrid}>
            {/* JOB TITLE */}

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Job Title
                <span className="form-required">*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                className="input"
                placeholder="e.g. Frontend Developer"
                value={form.title}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>

            {/* COMPANY */}

            <div className="form-group">
              <label htmlFor="companyName" className="form-label">
                Company Name
                <span className="form-required">*</span>
              </label>

              <input
                id="companyName"
                name="companyName"
                type="text"
                className="input"
                placeholder="e.g. ABC Technologies"
                value={form.companyName}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>

            {/* PACKAGE */}

            <div className="form-group">
              <label htmlFor="package" className="form-label">
                Package
                <span className="form-required">*</span>
              </label>

              <select
                id="package"
                name="package"
                className="select"
                value={form.package}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                <option value="">Select package</option>

                {PACKAGE_OPTIONS.map((packageOption) => (
                  <option key={packageOption} value={packageOption}>
                    {packageOption}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location
                <span className="form-required">*</span>
              </label>

              <input
                id="location"
                name="location"
                type="text"
                className="input"
                placeholder="e.g. Chennai"
                value={form.location}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>
          </div>
        </section>

        {/* =================================================
            SKILLS
        ================================================= */}

        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h3 className="section-title">Required Skills</h3>

            <p className="section-subtitle">
              Add the key technical or professional skills required for this
              position.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="skillsRequired" className="form-label">
              Skills
              <span className="form-required">*</span>
            </label>

            <input
              id="skillsRequired"
              name="skillsRequired"
              type="text"
              className="input"
              placeholder="e.g. React, JavaScript, CSS"
              value={form.skillsRequired}
              onChange={handleChange}
              disabled={submitting}
              required
            />

            <span className="form-helper">
              Separate multiple skills with commas.
            </span>
          </div>
        </section>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h3 className="section-title">Job Description</h3>

            <p className="section-subtitle">
              Describe the role, responsibilities and expectations.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
              <span className="form-required">*</span>
            </label>

            <textarea
              id="description"
              name="description"
              className="textarea"
              placeholder="Describe the role and responsibilities..."
              value={form.description}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>
        </section>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <footer className={styles.actions}>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting}
          >
            {submitting
              ? isEditing
                ? "Updating..."
                : "Posting..."
              : isEditing
                ? "Update Job"
                : "Post Job"}
          </button>
        </footer>
      </form>
    </section>
  );
};

export default CreateJob;
