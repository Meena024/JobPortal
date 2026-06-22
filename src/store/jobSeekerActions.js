import { jobSeekerActions } from "./jobSeekerSlice";

import { dbApi } from "../services/dbApi";

/*
  FETCH AVAILABLE JOBS

  JOBS STRUCTURE:

  jobs: {
    recruiterId: {
      jobId: {...}
    }
  }
*/

export const fetchAvailableJobs = () => {
  return async (dispatch) => {
    try {
      const data = await dbApi.get("jobs");

      if (!data) {
        dispatch(jobSeekerActions.setAvailableJobs([]));

        return;
      }

      /*
        FLATTEN JOBS
      */

      const allJobs = [];

      Object.entries(data).forEach(([_, recruiterJobs]) => {
        Object.entries(recruiterJobs).forEach(([jobId, job]) => {
          allJobs.push({
            id: jobId,
            ...job,
          });
        });
      });

      allJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      /*
        FILTER APPROVED + OPEN
      */

      const availableJobs = allJobs.filter(
        (job) =>
          job.status === "approved" &&
          (job.jobOpeningStatus || "open") === "open",
      );

      dispatch(jobSeekerActions.setAvailableJobs(availableJobs));
    } catch (err) {
      console.log("Fetch available jobs failed:", err);
    }
  };
};

/*
  FETCH RESUMES
*/

export const fetchResumes = (userId) => {
  return async (dispatch) => {
    try {
      const data = await dbApi.get(`resumes/${userId}`);

      if (!data) {
        dispatch(jobSeekerActions.setResumes([]));

        return;
      }

      const resumes = Object.entries(data).map(([id, resume]) => ({
        id,
        ...resume,
      }));

      dispatch(jobSeekerActions.setResumes(resumes));
    } catch (err) {
      console.log("Fetch resumes failed:", err);
    }
  };
};

/*
  ADD RESUME
*/

export const addResume = (userId, resumeData) => {
  return async (dispatch) => {
    try {
      const response = await dbApi.post(`resumes/${userId}`, resumeData);

      dispatch(
        jobSeekerActions.addResume({
          id: response.name,
          ...resumeData,
        }),
      );
    } catch (err) {
      console.log("Add resume failed:", err);
    }
  };
};

/*
  REMOVE RESUME
*/

export const removeResume = (userId, resumeId) => {
  return async (dispatch) => {
    try {
      await dbApi.remove(`resumes/${userId}/${resumeId}`);

      dispatch(jobSeekerActions.removeResume(resumeId));
    } catch (err) {
      console.log("Remove resume failed:", err);
    }
  };
};

/*
  EDIT RESUME
*/

export const editResume = (userId, resumeId, updatedData) => {
  return async (dispatch) => {
    try {
      await dbApi.patch(`resumes/${userId}/${resumeId}`, updatedData);

      dispatch(
        jobSeekerActions.updateResume({
          id: resumeId,

          updates: updatedData,
        }),
      );
    } catch (err) {
      console.log("Edit resume failed:", err);
    }
  };
};

/*
  FETCH APPLIED JOBS
*/

export const fetchAppliedJobs = (userId) => {
  return async (dispatch) => {
    try {
      /*
        APPLICATIONS STRUCTURE:

        applications: {
          recruiterId: {
            applicationId: {...}
          }
        }
      */

      const data = await dbApi.get("applications");

      if (!data) {
        dispatch(jobSeekerActions.setAppliedJobs([]));

        return;
      }

      const applications = [];

      Object.entries(data).forEach(([_, recruiterApps]) => {
        Object.entries(recruiterApps).forEach(([id, app]) => {
          if (app.applicantId === userId) {
            applications.push({
              id,
              ...app,
            });
          }
        });
      });

      applications.sort(
        (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt),
      );
      dispatch(jobSeekerActions.setAppliedJobs(applications));
    } catch (err) {
      console.log("Fetch applied jobs failed:", err);
    }
  };
};

/*
  FETCH SAVED JOBS
*/

export const fetchSavedJobs = (userId) => {
  return async (dispatch) => {
    try {
      const data = await dbApi.get(`savedJobs/${userId}`);

      dispatch(jobSeekerActions.setSavedJobs(data || {}));
    } catch (err) {
      console.log("Fetch saved jobs failed:", err);
    }
  };
};

/*
  SAVE JOB
*/

export const saveJob = (userId, jobId) => {
  return async (dispatch) => {
    try {
      await dbApi.patch(`savedJobs/${userId}`, {
        [jobId]: jobId,
      });

      dispatch(jobSeekerActions.addSavedJob(jobId));
    } catch (err) {
      console.log("Save job failed:", err);
    }
  };
};

/*
  UNSAVE JOB
*/

export const unsaveJob = (userId, jobId) => {
  return async (dispatch) => {
    try {
      await dbApi.remove(`savedJobs/${userId}/${jobId}`);

      dispatch(jobSeekerActions.removeSavedJob(jobId));
    } catch (err) {
      console.log("Unsave job failed:", err);
    }
  };
};

/*
  FETCH NOTIFICATIONS
*/

export const fetchNotifications = (userId) => {
  return async (dispatch) => {
    try {
      const data = await dbApi.get(`notifications/${userId}`);

      if (!data) {
        dispatch(jobSeekerActions.setNotifications([]));

        return;
      }

      const notifications = Object.entries(data).map(([id, note]) => ({
        id,
        ...note,
      }));

      notifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      dispatch(jobSeekerActions.setNotifications(notifications));
    } catch (err) {
      console.log("Fetch notifications failed:", err);
    }
  };
};

/*
  ADD NOTIFICATION
*/

export const addNotification = (userId, notificationData) => {
  return async (dispatch) => {
    try {
      const response = await dbApi.post(
        `notifications/${userId}`,
        notificationData,
      );

      dispatch(
        jobSeekerActions.addNotification({
          id: response.name,
          ...notificationData,
        }),
      );
    } catch (err) {
      console.log("Add notification failed:", err);
    }
  };
};

/*
  MARK NOTIFICATION READ
*/

export const markNotificationRead = (userId, notificationId) => {
  return async (dispatch) => {
    try {
      await dbApi.patch(`notifications/${userId}/${notificationId}`, {
        read: true,
      });

      dispatch(jobSeekerActions.markNotificationRead(notificationId));
    } catch (err) {
      console.log("Mark notification read failed:", err);
    }
  };
};

/*
  REMOVE NOTIFICATION
*/

export const removeNotification = (userId, notificationId) => {
  return async (dispatch) => {
    try {
      await dbApi.remove(`notifications/${userId}/${notificationId}`);

      dispatch(jobSeekerActions.removeNotification(notificationId));
    } catch (err) {
      console.log("Remove notification failed:", err);
    }
  };
};
