import { adminActions } from "./adminSlice";
import { dbApi } from "../services/dbApi";

/*
  FETCH ALL JOBS
*/

export const fetchAllJobs = () => {
  return async (dispatch) => {
    dispatch(adminActions.setLoading(true));

    dispatch(adminActions.setError(null));

    try {
      /*
        JOBS STRUCTURE:

        jobs: {
          recruiterId: {
            jobId: {...}
          }
        }
      */

      const data = await dbApi.get("jobs/");

      if (!data) {
        dispatch(adminActions.setAllJobs([]));

        return;
      }

      /*
        FLATTEN ALL JOBS
      */

      const jobs = [];

      Object.entries(data).forEach(([recruiterId, recruiterJobs]) => {
        Object.entries(recruiterJobs).forEach(([jobId, job]) => {
          jobs.push({
            id: jobId,

            recruiterId,

            ...job,
          });
        });
      });

      dispatch(adminActions.setAllJobs(jobs));
    } catch (err) {
      dispatch(adminActions.setError(err.message || "Failed to fetch jobs"));
    } finally {
      dispatch(adminActions.setLoading(false));
    }
  };
};

/*
  FETCH ALL USERS
*/

export const fetchAllUsers = () => {
  return async (dispatch) => {
    dispatch(adminActions.setLoading(true));

    try {
      const data = await dbApi.get("users");

      if (!data) {
        dispatch(adminActions.setAllUsers([]));
        return;
      }

      const users = Object.entries(data)
        .map(([id, value]) => ({
          id,
          ...value.profile,
        }))
        .filter((user) => user.role !== "admin");

      dispatch(adminActions.setAllUsers(users));
    } catch (err) {
      dispatch(adminActions.setError(err.message || "Failed to fetch users"));
    } finally {
      dispatch(adminActions.setLoading(false));
    }
  };
};

/*
  FETCH ALL APPLICATIONS
*/

export const fetchAllApplications = () => {
  return async (dispatch) => {
    dispatch(adminActions.setLoading(true));

    dispatch(adminActions.setError(null));

    try {
      const applicationsData = await dbApi.get("applications");

      if (!applicationsData) {
        dispatch(adminActions.setAllApplications([]));
        return;
      }

      const applications = [];

      Object.entries(applicationsData).forEach(
        ([recruiterId, recruiterApplications]) => {
          Object.entries(recruiterApplications).forEach(
            ([applicationId, application]) => {
              applications.push({
                id: applicationId,
                ...application,
              });
            },
          );
        },
      );
      console.log(applicationsData);
      // console.log(recruiterApplications);
      // console.log(application);
      dispatch(adminActions.setAllApplications(applications));
    } catch (err) {
      dispatch(
        adminActions.setError(err.message || "Failed to fetch applications"),
      );
    } finally {
      dispatch(adminActions.setLoading(false));
    }
  };
};
