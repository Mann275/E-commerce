import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};
