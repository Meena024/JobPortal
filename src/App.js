import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import HomeRedirect from "./pages/HomeRedirect";
import SignUp from "./pages/SignUp";
import Initializer from "./components/Initializer/Initializer";
import RecruiterDashboard from "./pages/Dashboard/RecruiterDashboard/RecruiterDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard/AdminDashboard";

import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./components/Layout/Layout";
import JobSeekerDashboard from "./pages/Dashboard/JobSeekerDashboard/JobSeekerDashboard";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    Initializer(dispatch, navigate);
  }, [dispatch, navigate]);

  return (
    <Layout>
      <Routes>
        {/* PUBLIC ROUTES */}

        <Route path="/" element={<HomeRedirect />} />

        <Route path="/signup" element={<SignUp />} />

        {/* JOB SEEKER ROUTES */}

        <Route
          path="/jobseeker/dashboard"
          element={
            <PrivateRoute allowedRoles={["job_seeker"]}>
              <JobSeekerDashboard />
            </PrivateRoute>
          }
        />

        {/* RECRUITER ROUTES */}

        <Route
          path="/recruiter/dashboard"
          element={
            <PrivateRoute allowedRoles={["recruiter"]}>
              <RecruiterDashboard />
            </PrivateRoute>
          }
        />

        {/* ADMIN ROUTES */}

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* DEFAULT ROUTE */}

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
