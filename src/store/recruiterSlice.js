import { createSlice } from "@reduxjs/toolkit";

const recruiterSlice = createSlice({
  name: "recruiter",

  initialState: {
    recruiterJobs: [],
    recruiterApplications: [],
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

    updateJob(state, action) {
      const { id, updates } = action.payload;

      const job = state.recruiterJobs.find((j) => j.id === id);

      if (job) {
        Object.assign(job, updates);
      }
    },

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

      const index = state.recruiterApplications.findIndex(
        (app) => app.id === id,
      );

      if (index !== -1) {
        state.recruiterApplications[index].status = status;
      }
    },

    updateOfferLetter(state, action) {
      const { id, offerLetterUrl } = action.payload;

      const index = state.recruiterApplications.findIndex(
        (app) => app.id === id,
      );

      if (index !== -1) {
        state.recruiterApplications[index].offerLetterUrl = offerLetterUrl;
      }
    },

    updateRecruiterNotes(state, action) {
      const { id, notes } = action.payload;

      const index = state.recruiterApplications.findIndex(
        (app) => app.id === id,
      );

      if (index !== -1) {
        state.recruiterApplications[index].recruiterNotes = notes;
      }
    },

    updateInterviewDetails(state, action) {
      const {
        id,
        interviewData,
        rescheduleHistory,
        rescheduleRequested,
        rescheduleRequestReason,
        rescheduleRequestedAt,
      } = action.payload;

      const application = state.recruiterApplications.find(
        (app) => app.id === id,
      );

      if (!application) return;

      application.interviewData = interviewData;

      if (rescheduleHistory !== undefined) {
        application.rescheduleHistory = rescheduleHistory;
      }

      if (rescheduleRequested !== undefined) {
        application.rescheduleRequested = rescheduleRequested;
      }

      if (rescheduleRequestReason !== undefined) {
        application.rescheduleRequestReason = rescheduleRequestReason;
      }

      if (rescheduleRequestedAt !== undefined) {
        application.rescheduleRequestedAt = rescheduleRequestedAt;
      }
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
