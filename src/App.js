import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import HomeRedirect from "./pages/HomeRedirect";
import SignUp from "./pages/SignUp";
import Initializer from "./components/Initializer/Initializer";

import PrivateRoute from "./routes/PrivateRoute";

/* =====================================================
   JOB SEEKER
===================================================== */

import JobSeekerDashboard from "./features/jobSeeker/JobSeekerDashboard";

import AvailableJobs from "./features/jobSeeker/AvailableJobs/AvailableJobs";
import AppliedJobs from "./features/jobSeeker/AppliedJobs/AppliedJobs";
import SavedJobs from "./features/jobSeeker/SavedJobs/SavedJobs";
import MyInterviews from "./features/jobSeeker/MyInterviews/MyInterviews";
import MyResumes from "./features/jobSeeker/MyResumes/MyResumes";
import Notifications from "./features/jobSeeker/Notifications/Notifications";

/* =====================================================
   RECRUITER
===================================================== */

import RecruiterDashboard from "./features/recruiter/RecruiterDashboard";

import CreateJob from "./features/recruiter/CreateJob/CreateJob";
import MyJobs from "./features/recruiter/MyJobs/MyJobs";
import RecruiterApplications from "./features/recruiter/RecruiterApplications/RecruiterApplications";
import RecruiterInterviews from "./features/recruiter/RecruiterInterviews/RecruiterInterviews";

/* =====================================================
   ADMIN
===================================================== */

import AdminDashboard from "./features/admin/AdminDashboard";

import JobApproval from "./features/admin/JobApproval/JobApproval";
import ManageUsers from "./features/admin/ManageUsers/ManageUsers";
import AllJobs from "./features/admin/AllJobs/AllJobs";
import Applications from "./features/admin/Applications/Applications";

import "./styles/global.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    Initializer(dispatch);
  }, [dispatch]);

  return (
    <Routes>
      {/* PUBLIC ROUTES */}

      <Route path="/" element={<HomeRedirect />} />

      <Route path="/signup" element={<SignUp />} />

      {/* JOB SEEKER ROUTES */}

      <Route
        path="/jobseeker"
        element={
          <PrivateRoute allowedRoles={["job_seeker"]}>
            <JobSeekerDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="available" replace />} />
        <Route path="available" element={<AvailableJobs />} />
        <Route path="applied" element={<AppliedJobs />} />
        <Route path="saved" element={<SavedJobs />} />
        <Route path="interviews" element={<MyInterviews />} />
        <Route path="resumes" element={<MyResumes />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* RECRUITER ROUTES */}

      <Route
        path="/recruiter"
        element={
          <PrivateRoute allowedRoles={["recruiter"]}>
            <RecruiterDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="jobs" replace />} />
        <Route path="create" element={<CreateJob />} />
        <Route path="jobs" element={<MyJobs />} />
        <Route path="applications" element={<RecruiterApplications />} />
        <Route path="interviews" element={<RecruiterInterviews />} />
      </Route>

      {/* ADMIN ROUTES */}

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="jobs" replace />} />
        <Route path="jobs" element={<JobApproval />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="all-jobs" element={<AllJobs />} />
        <Route path="applications" element={<Applications />} />
      </Route>

      {/* DEFAULT ROUTE */}

      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default App;
