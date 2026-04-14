import { createSlice } from "@reduxjs/toolkit";

const recruiterSlice = createSlice({
  name: "recruiter",

  initialState: {
    recruiterJobs: [],
    loading: false,
    error: null,
    activeView: "jobs",
    editingJob: null,
  },

  reducers: {
    setRecruiterJobs(state, action) {
      state.recruiterJobs = action.payload;
    },

    addRecruiterJob(state, action) {
      state.recruiterJobs.push(action.payload);
    },

    updateRecruiterJob(state, action) {
      const index = state.recruiterJobs.findIndex(
        (job) => job.id === action.payload.id,
      );

      if (index !== -1) {
        state.recruiterJobs[index] = action.payload;
      }
    },

    removeRecruiterJob(state, action) {
      state.recruiterJobs = state.recruiterJobs.filter(
        (job) => job.id !== action.payload,
      );
    },

    setActiveView(state, action) {
      state.activeView = action.payload;
    },

    setEditingJob(state, action) {
      state.editingJob = action.payload;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const recruiterActions = recruiterSlice.actions;

export default recruiterSlice.reducer;
