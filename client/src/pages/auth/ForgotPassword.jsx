import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Loader,
  ArrowLeft,
  Mail,
  Lock,
  KeyRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // Password validation rules
  const passwordRequirements = useMemo(() => {
    return [
      { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
      { label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
      { label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
      { label: "One number", test: (pwd) => /\d/.test(pwd) },
      {
        label: "One special character",
        test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      },
    ];
  }, []);

  const isPasswordValid = useMemo(() => {
    const validCount = passwordRequirements.filter((req) => req.test(newPassword)).length;
    return validCount >= 3;
  }, [newPassword, passwordRequirements]);

  const getPasswordStrength = useMemo(() => {
    if (!newPassword) return { level: 0, text: "", color: "" };

    const validCount = passwordRequirements.filter((req) =>
      req.test(newPassword),
    ).length;

    if (validCount === 5)
      return { level: 100, text: "Strong", color: "bg-green-500" };
    if (validCount >= 4)
      return { level: 80, text: "Good", color: "bg-blue-500" };
    if (validCount >= 3)
      return { level: 60, text: "Medium", color: "bg-yellow-500" };
    if (validCount >= 2)
      return { level: 40, text: "Weak", color: "bg-orange-500" };
    return { level: 20, text: "Very Weak", color: "bg-red-500" };
  }, [newPassword, passwordRequirements]);

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await axios.post(
        `${API_URL}/api/v1/users/forgotpassword`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (!error.response) {
        toast.error("Server is not running or unreachable.");
      } else {
        toast.error(error.response?.data?.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await axios.post(
        `${API_URL}/api/v1/users/verify-otp/${email}`,
        { otp },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(3);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (!error.response) {
        toast.error("Server is not running or unreachable.");
      } else {
        toast.error(error.response?.data?.message || "Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (!isPasswordValid) {
      toast.error("Password does not meet requirements");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await axios.post(
        `${API_URL}/api/v1/users/reset-password/${email}`,
        { newPassword, confirmPassword },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      if (!error.response) {
        toast.error("Server is not running or unreachable.");
      } else {
        toast.error(error.response?.data?.message || "Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>

      {/* Back Button */}
      <Link
        to="/login"
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-1.5 md:gap-2 text-white hover:text-blue-200 transition-colors bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/20 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        <span className="font-medium text-sm md:text-base hidden sm:inline">Back to Login</span>
      </Link>

      {/* Logo */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center bg-transparent px-2 py-1 md:px-4 md:py-2">
        <img
          src="https://res.cloudinary.com/mann2729/image/upload/v1772097164/logo_xdduls.png"
          alt="OverClocked Logo"
          className="w-10 h-10 md:w-16 md:h-16 object-contain"
        />
        <span className="text-lg md:text-2xl font-bold text-white ml-2">
          Over<span className="text-sky-400">Clocked</span>
        </span>
      </div>

      {/* Forgot Password Form */}
      <div
        className="bg-black/60 backdrop-blur-xl p-8 rounded-2xl border border-white/30 w-full max-w-md shadow-2xl z-40"
        style={{ pointerEvents: "auto" }}
      >
        <Card className="bg-transparent border-0 shadow-none">
          <CardHeader className="text-center pb-6 px-0">
            <CardTitle className="text-2xl font-bold text-white drop-shadow-lg">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Reset Password"}
            </CardTitle>
            <CardDescription className="text-gray-100 drop-shadow">
              {step === 1 && "Enter your email to receive OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Enter your new password"}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 pl-11"
                      placeholder="mann@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            )}

            {/* Step 2: OTP Input */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="otp" className="text-white font-medium">
                    Enter OTP
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      maxLength={6}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 pl-11 text-center tracking-widest text-lg"
                      placeholder="000000"
                      required
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-300 text-center">
                    OTP sent to {email}
                  </p>
                </div>
              </form>
            )}

            {/* Step 3: New Password Input */}
            {step === 3 && (
              <form
                onSubmit={handleResetPassword}
                className="flex flex-col gap-4"
              >
                <div className="grid gap-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-white font-medium"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 pl-11"
                      placeholder="Enter new password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {showPassword ? (
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white w-5 h-5"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowPassword(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white w-5 h-5"
                      />
                    )}
                  </div>

                  {/* Password Strength Bar */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">
                          Password Strength
                        </span>
                        <span
                          className={`text-xs font-medium ${getPasswordStrength.text === "Strong"
                            ? "text-green-400"
                            : getPasswordStrength.text === "Good"
                              ? "text-blue-400"
                              : getPasswordStrength.text === "Medium"
                                ? "text-yellow-400"
                                : getPasswordStrength.text === "Weak"
                                  ? "text-orange-400"
                                  : "text-red-400"
                            }`}
                        >
                          {getPasswordStrength.text}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getPasswordStrength.color} transition-all duration-300`}
                          style={{ width: `${getPasswordStrength.level}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-white font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 pl-11"
                      placeholder="Confirm new password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {showConfirmPassword ? (
                      <EyeOff
                        onClick={() => setShowConfirmPassword(false)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white w-5 h-5"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowConfirmPassword(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white w-5 h-5"
                      />
                    )}
                  </div>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-4 px-0 pt-6">
            <Button
              onClick={
                step === 1
                  ? handleSendOTP
                  : step === 2
                    ? handleVerifyOTP
                    : handleResetPassword
              }
              type="submit"
              className="w-full h-11 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  {step === 1 && "Sending OTP..."}
                  {step === 2 && "Verifying..."}
                  {step === 3 && "Resetting..."}
                </>
              ) : (
                <>
                  {step === 1 && "Send OTP"}
                  {step === 2 && "Verify OTP"}
                  {step === 3 && "Reset Password"}
                </>
              )}
            </Button>

            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Didn't receive OTP?{" "}
                <span className="text-purple-300 hover:underline">Resend</span>
              </button>
            )}

            <p className="text-center text-gray-100 text-sm relative z-50">
              Remember your password?{" "}
              <Link
                to="/login"
                className="hover:underline cursor-pointer text-purple-200 hover:text-white font-medium relative z-50"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;
