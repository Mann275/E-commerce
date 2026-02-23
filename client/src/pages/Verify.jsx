import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Verify() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>

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
          <p className="text-gray-100 drop-shadow">
            We've sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Verify;
