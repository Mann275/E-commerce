import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Verify() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.fromSignup) {
      navigate("/signup", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>

      {/* Back to Signup Button */}
      <Link
        to="/signup"
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-1.5 md:gap-2 text-white hover:text-blue-200 transition-colors bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/20 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        <span className="font-medium text-sm md:text-base hidden sm:inline">Back to Signup</span>
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

      {/* Verification Message */}
      <div
        className="bg-black/60 backdrop-blur-xl p-8 rounded-2xl border border-white/30 w-full max-w-md shadow-2xl z-40 text-center mx-4"
        style={{ pointerEvents: "auto" }}
      >
        <div className="mb-4">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-4">
            Check Your Email
          </h2>
          <p className="text-gray-100 drop-shadow mb-6">
            We've sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </p>
          <a
            href="https://mail.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-[0_0_15px_rgba(14,165,233,0.5)] hover:shadow-[0_0_25px_rgba(14,165,233,0.7)]"
          >
            Go to Email
          </a>
        </div>
      </div>
    </div>
  );
}

export default Verify;
