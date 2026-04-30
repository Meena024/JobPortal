import { createSlice } from "@reduxjs/toolkit";

const jobSeekerSlice = createSlice({
  name: "jobSeeker",

  initialState: {
    resumes: [],

    appliedJobs: [],

    savedJobs: [],

    activeView: "available",
  },

  reducers: {
    setResumes(state, action) {
      state.resumes = action.payload;
    },

    addResume(state, action) {
      state.resumes.push(action.payload);
    },

    removeResume(state, action) {
      state.resumes = state.resumes.filter((r) => r.id !== action.payload);
    },

    setAppliedJobs(state, action) {
      state.appliedJobs = action.payload;
    },

    setSavedJobs(state, action) {
      state.savedJobs = action.payload;
    },

    addSavedJob(state, action) {
      state.savedJobs.push(action.payload);
    },

    removeSavedJob(state, action) {
      state.savedJobs = state.savedJobs.filter(
        (job) => job.id !== action.payload,
      );
    },

    setActiveView(state, action) {
      state.activeView = action.payload;
    },
  },
});

export const jobSeekerActions = jobSeekerSlice.actions;

export default jobSeekerSlice.reducer;
