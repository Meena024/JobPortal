import { recruiterActions } from "./recruiterSlice";
import { dbApi } from "../services/dbApi";

/*
  FETCH RECRUITER JOBS
*/

export const fetchRecruiterJobs = (userId) => {
  return async (dispatch) => {
    dispatch(recruiterActions.setLoading(true));

    dispatch(recruiterActions.setError(null));

    try {
      const data = await dbApi.get(`jobs/${userId}`);

      if (!data) {
        dispatch(recruiterActions.setRecruiterJobs([]));

        return;
      }

      const jobs = Object.entries(data).map(([id, job]) => ({
        id,
        ...job,
      }));
      jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      dispatch(recruiterActions.setRecruiterJobs(jobs));
    } catch (err) {
      dispatch(
        recruiterActions.setError(
          err.message || "Failed to fetch recruiter jobs",
        ),
      );
    } finally {
      dispatch(recruiterActions.setLoading(false));
    }
  };
};

/*
  CREATE JOB
*/

export const createRecruiterJob = (userId, jobData) => {
  return async (dispatch) => {
    try {
      const response = await dbApi.post(`jobs/${userId}`, jobData);

      dispatch(
        recruiterActions.addRecruiterJob({
          id: response.name,
          ...jobData,
        }),
      );
    } catch (err) {
      console.log("Create job failed:", err);
    }
  };
};

/*
  UPDATE JOB
*/

export const updateRecruiterJob = (userId, jobId, updatedData) => {
  return async (dispatch) => {
    try {
      await dbApi.put(`jobs/${userId}/${jobId}`, updatedData);

      dispatch(
        recruiterActions.updateRecruiterJob({
          id: jobId,
          ...updatedData,
        }),
      );
    } catch (err) {
      console.log("Update job failed:", err);
    }
  };
};

/*
  DELETE JOB
*/

export const deleteRecruiterJob = (userId, jobId) => {
  return async (dispatch) => {
    try {
      await dbApi.remove(`jobs/${userId}/${jobId}`);

      dispatch(recruiterActions.removeRecruiterJob(jobId));
    } catch (err) {
      console.log("Delete job failed:", err);
    }
  };
};

/*
  CLOSE JOB
*/

export const closeRecruiterJob = (userId, jobId) => {
  return async (dispatch) => {
    try {
      await dbApi.patch(`jobs/${userId}/${jobId}`, {
        jobOpeningStatus: "closed",
      });

      dispatch(
        recruiterActions.updateJob({
          id: jobId,

          updates: {
            jobOpeningStatus: "closed",
          },
        }),
      );
    } catch (err) {
      console.log("Close job failed:", err);
    }
  };
};

/*
  FETCH RECRUITER APPLICATIONS
*/

export const fetchRecruiterApplications = (userId) => {
  return async (dispatch) => {
    dispatch(recruiterActions.setLoading(true));
    dispatch(recruiterActions.setError(null));

    try {
      const data = await dbApi.get(`applications/${userId}`);

      if (!data) {
        dispatch(recruiterActions.setRecruiterApplications([]));
        return;
      }

      const applications = Object.entries(data).map(([id, app]) => ({
        id,
        ...app,
      }));

      applications.sort(
        (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt),
      );
      dispatch(recruiterActions.setRecruiterApplications(applications));
    } catch (err) {
      dispatch(
        recruiterActions.setError(
          err.message || "Failed to fetch applications",
        ),
      );
    } finally {
      dispatch(recruiterActions.setLoading(false));
    }
  };
};

export const saveOfferLetter = (app, offerLetterUrl) => async (dispatch) => {
  try {
    const offerLetter = {
      url: offerLetterUrl,
      uploadedAt: new Date().toISOString(),
      uploadedBy: app.recruiterId,
    };

    await dbApi.patch(`applications/${app.recruiterId}/${app.id}`, {
      offerLetter,
    });

    dispatch(
      recruiterActions.updateOfferLetter({
        id: app.id,
        offerLetter,
      }),
    );

    await dispatch(
      createNotification(`Offer letter uploaded for "${app.jobTitle}".`, app),
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createNotification = (message, app) => async () => {
  try {
    await dbApi.post(`notifications/${app.applicantId}`, {
      message,
      applicationId: app.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Notification error:", err);
    throw err;
  }
};

export const statusChangeHandler =
  (app, status, additionalData = {}) =>
  async (dispatch) => {
    try {
      const updates = {
        status,
        updatedAt: new Date().toISOString(),
        ...additionalData,
      };

      await dbApi.patch(`applications/${app.recruiterId}/${app.id}`, updates);

      dispatch(
        recruiterActions.updateApplicationStatus({
          id: app.id,
          status,
          updates,
        }),
      );

      await dispatch(
        createNotification(
          `Your application for "${app.jobTitle}" is now ${status}.`,
          app,
        ),
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

export const updateRecruiterNotes = (app, notes) => async () => {
  try {
    await dbApi.patch(`applications/${app.recruiterId}/${app.id}`, {
      recruiterNotes: notes,
    });
  } catch (err) {
    console.error("Failed to update recruiter notes:", err);
    throw err;
  }
};

export const saveInterview = (app, form) => async (dispatch) => {
  try {
    let updatedHistory = app.interviewData?.rescheduleHistory || [];

    if (app.interviewData?.interviewScheduled) {
      updatedHistory = [
        ...updatedHistory,
        {
          previousDate: app.interviewData.interviewDate,
          previousTime: app.interviewData.interviewTime,
          reason: "Interview updated by recruiter",
          changedAt: new Date().toISOString(),
        },
      ];
    }

    const interviewData = {
      interviewScheduled: true,
      interviewStatus: "scheduled",
      interviewDate: form.interviewDate,
      interviewTime: form.interviewTime,
      interviewLink: form.interviewLink,
      interviewInstructions: form.interviewInstructions,

      rescheduleHistory: updatedHistory,

      rescheduleRequest: {
        rescheduleRequested: false,
        rescheduleRequestReason: "",
        rescheduleRequestedAt: "",
      },
    };

    await dbApi.patch(
      `applications/${app.recruiterId}/${app.id}/interviewData`,
      interviewData,
    );

    dispatch(
      recruiterActions.updateInterviewDetails({
        id: app.id,
        interviewData,
      }),
    );

    await dispatch(
      createNotification(
        `Interview scheduled for "${app.jobTitle}" on ${form.interviewDate} at ${form.interviewTime}.`,
        app,
      ),
    );
  } catch (err) {
    console.error("Save interview failed:", err);
    throw err;
  }
};

export const cancelInterview = (app) => async (dispatch) => {
  try {
    const updatedHistory = [
      ...(app.interviewData?.rescheduleHistory || []),
      {
        previousDate: app.interviewData?.interviewDate,
        previousTime: app.interviewData?.interviewTime,
        reason: "Interview cancelled by recruiter",
        changedAt: new Date().toISOString(),
      },
    ];

    const interviewData = {
      interviewScheduled: false,
      interviewStatus: "",

      interviewDate: "",
      interviewTime: "",
      interviewLink: "",
      interviewInstructions: "",

      rescheduleHistory: updatedHistory,

      rescheduleRequest: {
        rescheduleRequested: false,
        rescheduleRequestReason: "",
        rescheduleRequestedAt: "",
      },
    };

    await dbApi.patch(
      `applications/${app.recruiterId}/${app.id}/interviewData`,
      interviewData,
    );

    dispatch(
      recruiterActions.updateInterviewDetails({
        id: app.id,
        interviewData,
      }),
    );

    await dispatch(
      createNotification(
        `Interview for "${app.jobTitle}" has been cancelled.`,
        app,
      ),
    );
  } catch (err) {
    console.error("Cancel interview failed:", err);
    throw err;
  }
};

export const rescheduleInterview =
  (currentInterview, newDate, newTime, reason) => async (dispatch) => {
    try {
      const interviewData = currentInterview.interviewData || {};

      const updatedHistory = [
        ...(interviewData.rescheduleHistory || []),
        {
          previousDate: interviewData.interviewDate,
          previousTime: interviewData.interviewTime,
          reason,
          changedAt: new Date().toISOString(),
        },
      ];

      const updatedInterviewData = {
        ...interviewData,

        interviewDate: newDate,
        interviewTime: newTime,

        rescheduleHistory: updatedHistory,

        rescheduleRequest: {
          rescheduleRequested: false,
          rescheduleRequestReason: "",
          rescheduleRequestedAt: "",
        },
      };
      await dbApi.patch(
        `applications/${currentInterview.recruiterId}/${currentInterview.id}/interviewData`,
        updatedInterviewData,
      );

      dispatch(
        recruiterActions.updateInterviewDetails({
          id: currentInterview.id,
          interviewData: updatedInterviewData,
        }),
      );

      await dispatch(
        createNotification(
          `Interview for "${currentInterview.jobTitle}" has been rescheduled to ${newDate} at ${newTime}.`,
          currentInterview,
        ),
      );
    } catch (err) {
      console.error("Reschedule interview failed:", err);
      throw err;
    }
  };

export const submitInterviewFeedback = (app, comments) => async (dispatch) => {
  try {
    const interviewData = {
      ...app.interviewData,

      interviewStatus: "completed",

      recruiterFeedback: {
        submitted: true,
        comments,
        submittedAt: new Date().toISOString(),
      },
    };

    await dbApi.patch(
      `applications/${app.recruiterId}/${app.id}/interviewData`,
      interviewData,
    );

    dispatch(
      recruiterActions.updateInterviewDetails({
        id: app.id,
        interviewData,
      }),
    );

    await dispatch(
      createNotification(
        `Your interview for "${app.jobTitle}" has been marked as completed.`,
        app,
      ),
    );
  } catch (err) {
    console.error("Submit interview feedback failed:", err);
    throw err;
  }
};
