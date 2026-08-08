import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allJobs: [],
  availableJobs: [],
  resumes: [],
  appliedJobs: [],
  savedJobs: {},
  notifications: [],
  highlightedApplicationId: null,
  activeView: "available",
};

const jobSeekerSlice = createSlice({
  name: "jobSeeker",

  initialState,

  reducers: {
    setAllJobs(state, action) {
      state.allJobs = action.payload;
    },

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

    addAppliedJobs(state, action) {
      state.appliedJobs.push(action.payload);
    },

    updateInterviewData(state, action) {
      const { id, interviewData } = action.payload;

      const application = state.appliedJobs.find((app) => app.id === id);

      if (application) {
        application.interviewData = interviewData;
      }
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

    /*
      Reset
    */

    setReset() {
      return initialState;
    },
  },
});

export const jobSeekerActions = jobSeekerSlice.actions;

export default jobSeekerSlice.reducer;
