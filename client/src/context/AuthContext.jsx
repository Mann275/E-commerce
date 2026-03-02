import React, { createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../redux/userSlice";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // ============================================================================
  // LOGIN FUNCTION - Centralized authentication logic
  // ============================================================================
  const login = async (formData, rememberMe = false) => {
    try {
      const res = await axios.post(`${API_URL}/api/v1/users/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        // Store tokens and user data
        localStorage.setItem("accesstoken", res.data.accesstoken);
        localStorage.setItem("refreshtoken", res.data.refreshtoken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Dispatch user to Redux store
        dispatch(setUser(res.data.user));

        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
          localStorage.setItem("rememberedPassword", formData.password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }

        toast.success(res.data.message);
        navigate("/");

        return { success: true, data: res.data };
      }
    } catch (error) {
      console.error("Error during login:", error);

      if (!error.response) {
        toast.error("Server is not running or unreachable.");
      } else {
        toast.error(
          error.response?.data?.message || "An error occurred during login",
        );
      }

      return { success: false, error };
    }
  };

  // ============================================================================
  // SIGNUP FUNCTION - Centralized registration logic
  // ============================================================================
  const signup = async (formData) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/users/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/verify", { state: { fromSignup: true } });
        return { success: true, data: res.data };
      }
    } catch (error) {
      console.error("Error during signup:", error);

      if (!error.response) {
        toast.error("Server is not running or unreachable.");
      } else {
        toast.error(
          error.response?.data?.message || "An error occurred during signup",
        );
      }

      return { success: false, error };
    }
  };

  // ============================================================================
  // LOGOUT FUNCTION - Centralized logout logic
  // ============================================================================
  const logout = async () => {
    try {
      const token = localStorage.getItem("accesstoken");

      if (token) {
        // Optional: Call backend logout API if you have one
        await axios
          .post(
            `${API_URL}/api/v1/users/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          .catch(() => {
            // Silent fail - proceed with local logout anyway
          });
      }

      // Clear all auth data
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");
      localStorage.removeItem("user");

      // Clear Redux state
      dispatch(setUser(null));

      // Redirect to login
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);

      // Force logout even if API call fails
      localStorage.clear();
      dispatch(setUser(null));
      navigate("/login");
    }
  };

  // ============================================================================
  // DEMO LOGIN FUNCTION - For testing purposes
  // ============================================================================
  const demoLogin = async (role) => {
    const demoCreds = {
      customer: { email: "customer@example.com", password: "Mann123" },
      admin: { email: "admin@example.com", password: "Mann123" },
      seller: { email: "seller@example.com", password: "Mann123" },
    };

    if (demoCreds[role]) {
      return await login(demoCreds[role], false);
    }
  };

  // ============================================================================
  // VERIFY OTP FUNCTION - Email verification
  // ============================================================================
  const verifyOTP = async (email, otp) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/users/verify-email`,
        { email, otp },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
        return { success: true, data: res.data };
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error(error.response?.data?.message || "OTP verification failed");
      return { success: false, error };
    }
  };

  // ============================================================================
  // RESEND OTP FUNCTION
  // ============================================================================
  const resendOTP = async (email) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/users/resend-otp`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message || "OTP sent successfully");
        return { success: true, data: res.data };
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      return { success: false, error };
    }
  };

  // ============================================================================
  // FORGOT PASSWORD FUNCTION
  // ============================================================================
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/users/forgot-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        return { success: true, data: res.data };
      }
    } catch (error) {
      console.error("Error in forgot password:", error);
      toast.error(error.response?.data?.message || "Failed to send reset link");
      return { success: false, error };
    }
  };

  // ============================================================================
  // RESET PASSWORD FUNCTION
  // ============================================================================
  const resetPassword = async (token, newPassword) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/users/reset-password/${token}`,
        { password: newPassword },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
        return { success: true, data: res.data };
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
      return { success: false, error };
    }
  };

  const value = {
    login,
    signup,
    logout,
    demoLogin,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
