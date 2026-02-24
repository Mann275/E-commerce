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
import { Eye, EyeOff, Loader, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "customer", // default role
  });

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
    return passwordRequirements.every((req) => req.test(formData.password));
  }, [formData.password, passwordRequirements]);

  const getPasswordStrength = useMemo(() => {
    if (!formData.password) return { level: 0, text: "", color: "" };

    const validCount = passwordRequirements.filter((req) =>
      req.test(formData.password),
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
  }, [formData.password, passwordRequirements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    console.log(formData);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.success) {
        navigate("/verify");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during signup",
      );
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
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-blue-200 transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Logo */}
      <div className="fixed top-6 right-6 z-50 flex items-center bg-transparent px-4 py-2">
        <img
          src="/logo.png"
          alt="OverClocked Logo"
          className="w-25 h-25 object-contain"
        />
        <span className="text-2xl font-bold text-white">
          Over<span className="text-sky-400">Clocked</span>
        </span>
      </div>

      {/* Signup Form */}
      <div
        className="bg-black/60 backdrop-blur-xl p-8 rounded-2xl border border-white/30 w-full max-w-md shadow-2xl z-40"
        style={{ pointerEvents: "auto" }}
      >
        <Card className="bg-transparent border-0 shadow-none">
          <CardHeader className="text-center pb-6 px-0">
            <CardTitle className="text-2xl font-bold text-white drop-shadow-lg">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-100 drop-shadow">
              Join our community
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName" className="text-white font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    className="firstName bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    placeholder="Mann"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName" className="text-white font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    placeholder="Patel"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  placeholder="mann@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white font-medium">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(false)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(true)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white"
                    />
                  )}
                </div>

                {/* Password Strength Bar */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">
                        Password Strength
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          getPasswordStrength.text === "Strong"
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

              {/* Role Selection */}
              <div className="flex items-center gap-4 my-2 p-2 bg-white/5 rounded-lg border border-white/5">
                <span className="text-sm text-gray-100 mr-2 font-medium">
                  I am a:
                </span>
                <label className="flex items-center text-sm text-gray-200 gap-2 cursor-pointer hover:text-white transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={formData.role === "customer"}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  Customer
                </label>
                <label className="flex items-center text-sm text-gray-200 gap-2 cursor-pointer hover:text-white transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === "seller"}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  Seller
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 px-0 pt-6">
            <Button
              onClick={submitHandler}
              type="submit"
              className="w-full h-11 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-gray-100 text-sm relative z-50">
              Already have an account?{" "}
              <Link
                to="/login"
                className="hover:underline cursor-pointer text-blue-200 hover:text-white font-medium relative z-50"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
