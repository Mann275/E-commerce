import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/userSlice";

export const AuthInterceptor = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state) => state.user);

    // Global Axios Interceptor to catch 403 Banned or 401 Unauthorized securely
    useLayoutEffect(() => {
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.data?.isBanned || (error.response?.status === 403 && error.response?.data?.message?.includes("suspended"))) {
                    // Force the Banned State locally to trigger Guards natively
                    const currentUserStr = localStorage.getItem("user");
                    if (currentUserStr) {
                        const u = JSON.parse(currentUserStr);
                        u.status = "banned";
                        localStorage.setItem("user", JSON.stringify(u));
                        dispatch(setUser(u));
                    }
                    if (location.pathname !== "/banned") {
                        navigate("/banned", { replace: true });
                    }
                } else if (error.response?.status === 401 && location.pathname !== "/login" && location.pathname !== "/signup") {
                    localStorage.removeItem("user");
                    localStorage.removeItem("accesstoken");
                    dispatch(setUser(null));
                    navigate("/login", { replace: true });
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(responseInterceptor);
        }
    }, [dispatch, navigate, location.pathname]);

    // Background validation polling on route change
    useEffect(() => {
        const verifyAuthStatus = async () => {
            if (!isAuthenticated) return;

            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
                const token = localStorage.getItem("accesstoken");

                if (!token) return;

                const res = await axios.get(`${API_URL}/api/v1/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    const latestUserStr = JSON.stringify(res.data.user);
                    const currentUserStr = localStorage.getItem("user");

                    if (latestUserStr !== currentUserStr) {
                        localStorage.setItem("user", latestUserStr);
                        dispatch(setUser(res.data.user));

                        if (res.data.user?.status === "banned" && location.pathname !== "/banned") {
                            navigate("/banned", { replace: true });
                        }
                    }
                }
            } catch (error) {
                // The global Axios Interceptor handles the rejection silently. 
            }
        };

        verifyAuthStatus();
    }, [location.pathname, isAuthenticated, dispatch, navigate]);

    return <>{children}</>;
};
