import { fetchUserId } from "../../services/authApi";
import { authActions } from "../../store/authSlice";
import { dbApi } from "../../services/dbApi";
import {
  fetchRecruiterApplications,
  fetchRecruiterJobs,
} from "../../store/recruiterActions";
import {
  fetchResumes,
  fetchAppliedJobs,
  fetchSavedJobs,
  fetchNotifications,
  fetchAvailableJobs,
} from "../../store/jobSeekerActions";
import {
  fetchAllJobs,
  fetchAllApplications,
  fetchAllUsers,
} from "../../store/adminActions";

const Initializer = async (dispatch) => {
  const token = localStorage.getItem("token");
  console.log("token", token);

  if (!token) {
    return;
  }

  try {
    const userId = await fetchUserId(token);
    console.log("1. userId", userId);
    const profile = await dbApi.get(`users/${userId}/profile`);

    const authData = {
      token,
      userId,
      emailId: profile.email,
      role: profile.role,
    };
    console.log("2. authData", authData);
    dispatch(authActions.AuthSet(authData));

    switch (profile.role) {
      case "recruiter":
        await dispatch(fetchRecruiterJobs(userId));
        console.log("3.1 fetched fetchRecruiterJobs");

        await dispatch(fetchRecruiterApplications(userId));
        console.log("3.2 fetched fetchRecruiterApplications");
        break;

      case "admin":
        await dispatch(fetchAllJobs());
        console.log("4.1 fetched fetchAllJobs");

        await dispatch(fetchAllApplications());
        console.log("4.2 fetched fetchAllApplications");

        await dispatch(fetchAllUsers());
        console.log("4.3 fetched fetchAllUsers");
        break;

      case "job_seeker":
      default:
        await dispatch(fetchAvailableJobs());
        console.log("5.0 fetched fetchAvailableJobs");

        await dispatch(fetchResumes(userId));
        console.log("5.1 fetched fetchResumes");

        await dispatch(fetchAppliedJobs(userId));
        console.log("5.2 fetched fetchAppliedJobs");

        await dispatch(fetchSavedJobs(userId));
        console.log("5.3 fetched fetchSavedJobs");

        await dispatch(fetchNotifications(userId));
        console.log("5.4 fetched fetchNotifications");
        break;
    }
  } catch (err) {
    console.error("Initializer Error:", err);
    localStorage.removeItem("token");
    dispatch(authActions.logout());
  }
};

export default Initializer;
