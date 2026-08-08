import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recruiterJobs: [],
  recruiterApplications: [],
  loading: false,
  error: null,
  activeView: "jobs",
  editingJob: null,
};

const recruiterSlice = createSlice({
  name: "recruiter",

  initialState,

  reducers: {
    /*
      JOBS
    */

    setRecruiterJobs(state, action) {
      state.recruiterJobs = action.payload;
    },

    addRecruiterJob(state, action) {
      state.recruiterJobs.unshift(action.payload);
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

    updateJob(state, action) {
      const { id, updates } = action.payload;

      const job = state.recruiterJobs.find((j) => j.id === id);

      if (job) {
        Object.assign(job, updates);
      }
    },

    /*
      APPLICATIONS
    */

    setRecruiterApplications(state, action) {
      state.recruiterApplications = action.payload;
    },

    removeRecruiterApplication(state, action) {
      state.recruiterApplications = state.recruiterApplications.filter(
        (app) => app.id !== action.payload,
      );
    },

    updateApplicationStatus(state, action) {
      const { id, status } = action.payload;

      const application = state.recruiterApplications.find(
        (app) => app.id === id,
      );

      if (application) {
        application.status = status;
      }
    },

    updateOfferLetter(state, action) {
      const { id, offerLetterUrl } = action.payload;

      const application = state.recruiterApplications.find(
        (app) => app.id === id,
      );

      if (application) {
        application.offerLetterUrl = offerLetterUrl;
      }
    },

    updateRecruiterNotes(state, action) {
      const { id, notes } = action.payload;

      const application = state.recruiterApplications.find(
        (app) => app.id === id,
      );

      if (application) {
        application.recruiterNotes = notes;
      }
    },

    /*
      INTERVIEW
    */

    updateInterviewDetails(state, action) {
      const { id, interviewData } = action.payload;

      const application = state.recruiterApplications.find(
        (app) => app.id === id,
      );

      if (!application) return;

      application.interviewData = interviewData;
    },

    /*
      UI
    */

    setActiveView(state, action) {
      state.activeView = action.payload;
    },

    setEditingJob(state, action) {
      state.editingJob = action.payload;
    },

    /*
      STATUS
    */

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },

    /*
      RESET
    */

    setReset() {
      return initialState;
    },
  },
});

export const recruiterActions = recruiterSlice.actions;

export default recruiterSlice.reducer;
