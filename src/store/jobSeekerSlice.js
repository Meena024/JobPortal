import { createSlice } from "@reduxjs/toolkit";

const jobSeekerSlice = createSlice({
  name: "jobSeeker",

  initialState: {
    availableJobs: [],

    resumes: [],

    appliedJobs: [],

    savedJobs: {},

    notifications: [],

    highlightedApplicationId: null,

    activeView: "available",
  },

  reducers: {
    setAvailableJobs(state, action) {
      state.availableJobs = action.payload;
    },

    /*
      RESUMES
    */

    setResumes(state, action) {
      state.resumes = action.payload;
    },

    addResume(state, action) {
      state.resumes.push(action.payload);
    },

    removeResume(state, action) {
      state.resumes = state.resumes.filter((r) => r.id !== action.payload);
    },

    updateResume(state, action) {
      const { id, updates } = action.payload;

      const resume = state.resumes.find((r) => r.id === id);

      if (resume) {
        Object.assign(resume, updates);
      }
    },

    /*
      APPLIED JOBS
    */

    setAppliedJobs(state, action) {
      state.appliedJobs = action.payload;
    },

    /*
      SAVED JOBS
    */

    setSavedJobs(state, action) {
      state.savedJobs = action.payload;
    },

    addSavedJob(state, action) {
      const jobId = action.payload;

      state.savedJobs[jobId] = jobId;
    },

    removeSavedJob(state, action) {
      delete state.savedJobs[action.payload];
    },

    /*
      VIEW
    */

    setActiveView(state, action) {
      state.activeView = action.payload;
    },

    /*
      NOTIFICATIONS
    */

    setNotifications(state, action) {
      state.notifications = action.payload;
    },

    addNotification(state, action) {
      state.notifications.unshift(action.payload);
    },

    removeNotification(state, action) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
    },

    markNotificationRead(state, action) {
      const note = state.notifications.find((n) => n.id === action.payload);

      if (note) {
        note.read = true;
      }
    },

    /*
      HIGHLIGHT
    */

    setHighlightedApplication(state, action) {
      state.highlightedApplicationId = action.payload;
    },

    clearHighlightedApplication(state) {
      state.highlightedApplicationId = null;
    },
  },
});

export const jobSeekerActions = jobSeekerSlice.actions;

export default jobSeekerSlice.reducer;
