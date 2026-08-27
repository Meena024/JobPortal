import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../features/auth/Login/Login";

const HomeRedirect = () => {
  const role = useSelector((state) => state.auth.role);

  if (role === "recruiter") {
    return <Navigate to="/recruiter" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "job_seeker") {
    return <Navigate to="/jobseeker" replace />;
  }

  return <Login />;
};

export default HomeRedirect;
