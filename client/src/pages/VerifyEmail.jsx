import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { toast } from "sonner";

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        setStatus("✅ Email verified successfully");
        setIsVerifying(false);

        // Store tokens and user data for auto-login
        localStorage.setItem("accesstoken", res.data.accesstoken);
        localStorage.setItem("refreshtoken", res.data.refreshtoken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success(res.data.message);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setStatus("❌ Email verification failed");
        setIsVerifying(false);
      }
    } catch (error) {
      console.error("Error during email verification:", error);
      setStatus("❌ Verification failed. Please try again.");
      setIsVerifying(false);
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-cyan-900 to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>

      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-blue-200 transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Verification Status */}
      <div
        className="bg-black/60 backdrop-blur-xl p-8 rounded-2xl border border-white/30 w-full max-w-md shadow-2xl z-40 text-center mx-4"
        style={{ pointerEvents: "auto" }}
      >
        {isVerifying ? (
          <div className="flex flex-col items-center">
            <Loader className="h-12 w-12 animate-spin text-white mb-4" />
            <h2 className="text-xl font-semibold text-white drop-shadow-lg">
              {status}
            </h2>
          </div>
        ) : (
          <div>
            <div className="text-6xl mb-4">
              {status.includes("✅") ? "✅" : "❌"}
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow-lg">
              {status}
            </h2>
            {status.includes("successfully") && (
              <p className="text-gray-200 mt-2 text-sm">
                Logging you in and redirecting to home...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
