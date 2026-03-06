import React, { createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setUser } from "../redux/userSlice";
import { clearCart } from "../redux/cartSlice";
import { clearWishlist } from "../redux/wishlistSlice";
import { authService } from "../services";

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

  // LOGIN FUNCTION - Centralized authentication logic using authService
  const login = async (formData, rememberMe = false) => {
    try {
      // 2 second delay for smooth UX
      const timer = new Promise(resolve => setTimeout(resolve, 2000));
      const [data] = await Promise.all([
        authService.login(formData),
        timer
      ]);

      if (data.success) {
        // Store tokens and user data
        localStorage.setItem("accesstoken", data.accesstoken);
        localStorage.setItem("refreshtoken", data.refreshtoken);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Dispatch user to Redux store
        dispatch(setUser(data.user));

        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
          localStorage.setItem("rememberedPassword", formData.password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }

        toast.success(data.message);
        navigate("/");

        return { success: true, data };
      }
    } catch (error) {
      // Handle different error scenarios
      if (!error.response) {
        // Network error or server not reachable
        toast.error("Cannot connect to server. Please check your connection.");
      } else if (error.response.status === 400) {
        // Bad request - wrong credentials or validation error
        const errorMessage =
          error.response?.data?.message || "Invalid email or password";
        toast.error(errorMessage);
      } else if (error.response.status === 500) {
        // Server error
        toast.error("Server error. Please try again later.");
      } else {
        // Other errors
        toast.error(
          error.response?.data?.message || "An error occurred during login",
        );
      }

      return { success: false, error };
    }
  };

  // SIGNUP FUNCTION - Centralized registration logic using authService
  const signup = async (formData) => {
    try {
      const data = await authService.register(formData);

      if (data.success) {
        toast.success(data.message);
        navigate("/verify", {
          state: { fromSignup: true, email: formData.email },
        });
        return { success: true, data };
      }
    } catch (error) {
      // Handle different error scenarios
      if (!error.response) {
        toast.error("Cannot connect to server. Please check your connection.");
      } else if (error.response.status === 400) {
        // Bad request - validation error or user already exists
        const errorMessage =
          error.response?.data?.message || "Registration failed";
        toast.error(errorMessage);
      } else if (error.response.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message || "An error occurred during signup",
        );
      }

      return { success: false, error };
    }
  };

  // LOGOUT FUNCTION - Centralized logout logic
  const logout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      // Call backend logout API (ignore errors)
      await authService.logout().catch(() => { });
    } catch (error) {
      // Silent error handling - logout locally anyway
    } finally {
      // Always clear local data regardless of API response
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");
      localStorage.removeItem("user");

      // Clear Redux state
      dispatch(setUser(null));
      dispatch(clearCart());
      dispatch(clearWishlist());

      // Redirect to login
      navigate("/login");
      toast.dismiss(toastId);
      toast.success("Logged out successfully");
    }
  };

  // DEMO LOGIN FUNCTION - For testing purposes
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

  // VERIFY OTP FUNCTION - Email verification
  const verifyOTP = async (email, otp) => {
    try {
      const data = await authService.verifyOTP(otp);

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
        return { success: true, data };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      return { success: false, error };
    }
  };

  // RESEND OTP FUNCTION using authService
  const resendOTP = async (email) => {
    try {
      const data = await authService.resendOTP();

      if (data.success) {
        toast.success(data.message || "OTP sent successfully");
        return { success: true, data };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      return { success: false, error };
    }
  };

  // FORGOT PASSWORD FUNCTION using authService
  const forgotPassword = async (email) => {
    try {
      const data = await authService.forgotPassword(email);

      if (data.success) {
        toast.success(data.message);
        return { success: true, data };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
      return { success: false, error };
    }
  };

  // RESET PASSWORD FUNCTION using authService
  const resetPassword = async (token, newPassword) => {
    try {
      const data = await authService.resetPassword(token, newPassword);

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
        return { success: true, data };
      }
    } catch (error) {
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
