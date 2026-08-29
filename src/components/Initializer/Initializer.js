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

  if (!token) {
    dispatch(authActions.InitializationComplete());

    return { success: false };
  }

  try {
    const userId = await fetchUserId(token);

    const profile = await dbApi.get(`users/${userId}/profile`);

    if (!profile) {
      localStorage.removeItem("token");

      dispatch(authActions.accountDeleted());

      return { accountDeleted: true };
    }

    dispatch(
      authActions.AuthSet({
        token,
        userId,
        emailId: profile.email,
        role: profile.role,
      }),
    );

    switch (profile.role) {
      case "recruiter":
        await Promise.all([
          dispatch(fetchRecruiterJobs(userId)),
          dispatch(fetchRecruiterApplications(userId)),
        ]);
        break;

      case "admin":
        await Promise.all([
          dispatch(fetchAllJobs()),
          dispatch(fetchAllApplications()),
          dispatch(fetchAllUsers()),
        ]);
        break;

      case "job_seeker":
      default:
        await Promise.all([
          dispatch(fetchAvailableJobs()),
          dispatch(fetchResumes(userId)),
          dispatch(fetchAppliedJobs(userId)),
          dispatch(fetchSavedJobs(userId)),
          dispatch(fetchNotifications(userId)),
        ]);
        break;
    }

    return { success: true };
  } catch (err) {
    console.error("Initializer Error:", err);
    localStorage.removeItem("token");
    dispatch(authActions.logout());

    return { success: false };
  }
};

export default Initializer;
