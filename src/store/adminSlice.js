// store/adminSlice.js

import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",

  initialState: {
    allJobs: [],
    allApplications: [],
    allUsers: [],

    loading: false,
    error: null,
  },

  reducers: {
    /*
      JOBS
    */

    setAllJobs(state, action) {
      state.allJobs = action.payload;
    },

    removeJob(state, action) {
      state.allJobs = state.allJobs.filter((job) => job.id !== action.payload);
    },

    updateJobStatus(state, action) {
      const { id, status, rejectionReason } = action.payload;

      const job = state.allJobs.find((j) => j.id === id);

      if (job) {
        job.status = status;

        if (rejectionReason) {
          job.rejectionReason = rejectionReason;
        }
      }
    },

    /*
      APPLICATIONS
    */

    setAllApplications(state, action) {
      state.allApplications = action.payload;
    },

    removeApplication(state, action) {
      state.allApplications = state.allApplications.filter(
        (app) => app.id !== action.payload,
      );
    },

    /*
      USERS
    */

    setAllUsers(state, action) {
      state.allUsers = action.payload;
    },

    removeUser(state, action) {
      state.allUsers = state.allUsers.filter(
        (user) => user.id !== action.payload,
      );
    },

    /*
      COMMON
    */

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const adminActions = adminSlice.actions;

export default adminSlice.reducer;
