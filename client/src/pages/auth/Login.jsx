import React, { useState } from "react";
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

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Load saved credentials on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.success) {
        // Store tokens and user data
        localStorage.setItem("accesstoken", res.data.accesstoken);
        localStorage.setItem("refreshtoken", res.data.refreshtoken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
          localStorage.setItem("rememberedPassword", formData.password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }

        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during login",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>

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

      {/* Login Form */}
      <div
        className="bg-black/60 backdrop-blur-xl p-8 rounded-2xl border border-white/30 w-full max-w-md shadow-2xl z-40"
        style={{ pointerEvents: "auto" }}
      >
        <Card className="bg-transparent border-0 shadow-none">
          <CardHeader className="text-center pb-6 px-0">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-200">
              Login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="flex flex-col gap-4">
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
                      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-whiteer"
                    />
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-200 gap-2 cursor-pointer hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-blue-500 cursor-pointer"
                  />
                  Remember Me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-200 hover:text-white hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
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
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-gray-100 text-sm relative z-50">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="hover:underline cursor-pointer text-blue-200 hover:text-white font-medium relative z-50"
              >
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Login;
