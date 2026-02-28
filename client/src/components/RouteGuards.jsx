import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.status === "banned") {
        return <Navigate to="/banned" replace />;
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

export const CustomerOnlyRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);

    if (user?.status === "banned") {
        return <Navigate to="/banned" replace />;
    }

    // If logged in as seller, don't allow access to customer pages like products
    if (isAuthenticated && user?.role === "seller") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);

    if (isAuthenticated) {
        if (user?.status === "banned") {
            return <Navigate to="/banned" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export const BannedOnlyRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.status !== "banned") {
        return <Navigate to="/" replace />;
    }

    return children;
};
