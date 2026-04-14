import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import JobsPage from "./pages/Jobs/JobsPage";
import RecruiterDashboard from "./pages/Dashboard/RecruiterDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            {/* PUBLIC ROUTES */}

            <Route path="/" element={<Login />} />

            <Route path="/signup" element={<SignUp />} />

            {/* JOB SEEKER ROUTES */}

            <Route
              path="/jobs"
              element={
                <PrivateRoute allowedRoles={["job_seeker"]}>
                  <JobsPage />
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

            <Route path="*" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
