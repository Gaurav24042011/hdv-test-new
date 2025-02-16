import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Replace with your auth context path

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user?.name) {
    return <Navigate to="/login" />;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.some((role) => user?.role?.toLowerCase()?.includes(role?.toLowerCase()))
  ) {
    return <Navigate to="/" replace />; // Redirect unauthorized users
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
