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

const Initializer = async (dispatch) => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const userId = await fetchUserId(token);

    const profile = await dbApi.get(`users/${userId}/profile`);

    const authData = {
      token,
      userId,
      emailId: profile.email,
      role: profile.role,
    };

    dispatch(authActions.AuthSet(authData));

    if (profile.role === "recruiter") {
      await dispatch(fetchRecruiterJobs(userId));
      await dispatch(fetchRecruiterApplications(userId));
    } else if (profile.role === "admin") {
      await dispatch(fetchAllJobs());
      await dispatch(fetchAllApplications());
      await dispatch(fetchAllUsers());
    } else {
      await dispatch(fetchResumes(userId));
      await dispatch(fetchAppliedJobs(userId));
      await dispatch(fetchSavedJobs(userId));
      await dispatch(fetchNotifications(userId));
    }
    return profile.role;
  } catch (err) {
    console.log(err);
  }
};

export default Initializer;
