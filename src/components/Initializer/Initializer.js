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
} from "../../store/jobSeekerActions";
import {
  fetchAllJobs,
  fetchAllApplications,
  fetchAllUsers,
} from "../../store/adminActions";

const Initializer = async (dispatch, navigate) => {
  const token = localStorage.getItem("token");
  console.log("token", token);
  if (!token) return;

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

    if (profile.role === "recruiter") {
      await dispatch(fetchRecruiterJobs(userId));
      console.log("3.1 fetched fetchRecruiterJobs");
      await dispatch(fetchRecruiterApplications(userId));
      console.log("3.2 fetched fetchRecruiterApplications");
    } else if (profile.role === "admin") {
      await dispatch(fetchAllJobs());
      console.log("4.1 fetched fetchAllJobs");
      await dispatch(fetchAllApplications());
      console.log("4.2 fetched fetchAllApplications");
      await dispatch(fetchAllUsers());
      console.log("4.3 fetched fetchAllUsers");
    } else {
      await dispatch(fetchResumes(userId));
      console.log("5.1 fetched fetchResumes");
      await dispatch(fetchAppliedJobs(userId));
      console.log("5.2 fetched fetchAppliedJobs");
      await dispatch(fetchSavedJobs(userId));
      console.log("5.3 fetched fetchSavedJobs");
      await dispatch(fetchNotifications(userId));
      console.log("5.4 fetched fetchNotifications");
    }

    let role = profile.role;
    if (role === "recruiter") {
      navigate("/recruiter/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/jobseeker/dashboard");
    }
    return profile.role;
  } catch (err) {
    console.log(err);
  }
};

export default Initializer;
