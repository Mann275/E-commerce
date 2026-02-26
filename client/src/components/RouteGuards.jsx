import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
        if (user?.role === "seller") {
            return <Navigate to="/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    // Role-specific landing: If a seller hits the root '/' but they should be on dashboard
    // We handle it in the router or let them access Home but not Cart/Products.

    return children;
};

export const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};
