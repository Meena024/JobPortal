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
