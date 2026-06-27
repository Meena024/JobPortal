import { useState } from "react";

import classes from "../../../Styling/Pages/RecruiterDashboard/CreateJob.module.css";

import { useDispatch, useSelector } from "react-redux";

import { recruiterActions } from "../../../store/recruiterSlice";

import {
  createRecruiterJob,
  updateRecruiterJob,
} from "../../../store/recruiterActions";

const CreateJob = () => {
  const dispatch = useDispatch();

  /*
    LOADING STATE
  */

  const [submitting, setSubmitting] = useState(false);

  /*
    AUTH
  */

  const userId = useSelector((state) => state.auth.userId);

  const recruiterEmail =
    useSelector((state) => state.auth.emailId) || "Unknown Recruiter";

  /*
    EDITING JOB
  */

  const editingJob = useSelector((state) => state.recruiter.editingJob);

  /*
    FORM STATE
  */

  const [form, setForm] = useState(
    editingJob || {
      title: "",
      companyName: "",
      salary: "",
      location: "",
      skillsRequired: "",
      description: "",
    },
  );

  /*
    INPUT CHANGE HANDLER
  */

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /*
    SUBMIT HANDLER
  */

  const submitHandler = async (e) => {
    e.preventDefault();

    /*
      PREVENT MULTIPLE CLICKS
    */

    if (submitting) return;

    try {
      setSubmitting(true);

      const jobData = {
        ...form,

        userId,

        recruiterEmail,

        status: editingJob?.status || "pending",

        createdAt: editingJob?.createdAt || new Date().toISOString(),
      };

      /*
        UPDATE JOB
      */

      if (editingJob) {
        await dispatch(updateRecruiterJob(userId, editingJob.id, jobData));
      } else {
        /*
          CREATE JOB
        */

        await dispatch(createRecruiterJob(userId, jobData));
      }

      /*
        RESET EDIT MODE
      */

      dispatch(recruiterActions.setEditingJob(null));

      /*
        GO TO JOBS VIEW
      */

      dispatch(recruiterActions.setActiveView("jobs"));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <h2>{editingJob ? "Update Job" : "Create Job"}</h2>

      <input
        name="title"
        placeholder="Job Title"
        value={form.title}
        onChange={changeHandler}
        disabled={submitting}
        required
      />

      <input
        name="companyName"
        placeholder="Company Name"
        value={form.companyName}
        onChange={changeHandler}
        disabled={submitting}
        required
      />

      <input
        name="salary"
        placeholder="Salary"
        value={form.salary}
        onChange={changeHandler}
        disabled={submitting}
        required
      />

      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={changeHandler}
        disabled={submitting}
        required
      />

      <input
        name="skillsRequired"
        placeholder="Skills Required"
        value={form.skillsRequired}
        onChange={changeHandler}
        disabled={submitting}
        required
      />

      <textarea
        name="description"
        placeholder="Job Description"
        value={form.description}
        onChange={changeHandler}
        disabled={submitting}
        required
      />

      <button disabled={submitting}>
        {submitting
          ? editingJob
            ? "Updating..."
            : "Posting..."
          : editingJob
            ? "Update Job"
            : "Post Job"}
      </button>
    </form>
  );
};

export default CreateJob;
