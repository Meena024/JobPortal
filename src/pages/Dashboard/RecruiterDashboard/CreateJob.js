import { useState } from "react";

import classes from "../../../Styling/Pages/CreateJob.module.css";

import { dbApi } from "../../../services/dbApi";

import { useDispatch, useSelector } from "react-redux";

import { recruiterActions } from "../../../store/recruiterSlice";

const CreateJob = () => {
  const dispatch = useDispatch();

  const recruiterId = localStorage.getItem("userId");

  const editingJob = useSelector((state) => state.recruiter.editingJob);

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

  const changeHandler = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const jobData = {
      ...form,

      recruiterId,

      status: editingJob?.status || "pending",

      createdAt: editingJob?.createdAt || new Date().toISOString(),
    };

    try {
      if (editingJob) {
        await dbApi.put(
          `jobs/${editingJob.id}`,

          jobData,
        );

        dispatch(
          recruiterActions.updateRecruiterJob({
            id: editingJob.id,

            ...jobData,
          }),
        );
      } else {
        const response = await dbApi.post(
          "jobs",

          jobData,
        );

        dispatch(
          recruiterActions.addRecruiterJob({
            id: response.name,

            ...jobData,
          }),
        );
      }

      dispatch(recruiterActions.setEditingJob(null));

      dispatch(recruiterActions.setActiveView("jobs"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <h2>Create Job</h2>

      <input
        name="title"
        placeholder="Job Title"
        value={form.title}
        onChange={changeHandler}
      />

      <input
        name="companyName"
        placeholder="Company Name"
        value={form.companyName}
        onChange={changeHandler}
      />

      <input
        name="salary"
        placeholder="Salary"
        value={form.salary}
        onChange={changeHandler}
      />

      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={changeHandler}
      />

      <input
        name="skillsRequired"
        placeholder="Skills Required"
        value={form.skillsRequired}
        onChange={changeHandler}
      />

      <textarea
        name="description"
        placeholder="Job Description"
        value={form.description}
        onChange={changeHandler}
      />

      <button>{editingJob ? "Update Job" : "Post Job"}</button>
    </form>
  );
};

export default CreateJob;
