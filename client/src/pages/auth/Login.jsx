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
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
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

        navigate("/");
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCreds = {
      customer: { email: "customer@example.com", password: "Mann123" },
      admin: { email: "admin@example.com", password: "Mann123" },
      seller: { email: "seller@example.com", password: "Mann123" }
    };

    setFormData(demoCreds[role]);
    setRememberMe(false);

    // Use a small timeout to ensure state is updated before submit
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => { } };
      // We need to call the actual logic here or use a ref/effect
      // To keep it simple, I'll just trigger the login with direct data passing if I refactor submitHandler, 
      // but for now, I'll just let the user click "Sign In" after it fills, 
      // OR better: call a dedicated login function.
      // Given React batching, it's safer to just provide the buttons that fill the form.
    }, 100);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>

      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-1.5 md:gap-2 text-white hover:text-blue-200 transition-colors bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/20 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        <span className="font-medium text-sm md:text-base hidden sm:inline">
          Back to Home
        </span>
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

            <div className="w-full pt-4 border-t border-white/10 mt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center mb-4">Demo Accounts</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setFormData({ email: "customer@example.com", password: "Mann123" }); }}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/20 text-[10px] h-8 px-0"
                >
                  Customer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setFormData({ email: "admin@example.com", password: "Mann123" }); }}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/20 text-[10px] h-8 px-0"
                >
                  Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setFormData({ email: "seller@example.com", password: "Mann123" }); }}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/20 text-[10px] h-8 px-0"
                >
                  Seller
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Login;
