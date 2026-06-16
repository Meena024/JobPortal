import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./Login";

const HomeRedirect = () => {
  const role = useSelector((state) => state.auth.role);

  if (role === "recruiter") {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === "job_seeker") {
    return <Navigate to="/jobseeker/dashboard" replace />;
  }

  return <Login />;
};

export default HomeRedirect;
