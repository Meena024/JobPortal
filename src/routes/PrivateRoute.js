import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { token, role, isInitialized } = useSelector((state) => state.auth);

  const location = useLocation();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
