import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ShieldAlert,
  ArrowRight,
  UserX,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { logout, setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

function BannedPage() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const adminEmail = "admin@overclocked.com";

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(adminEmail);
    setCopied(true);
    toast.success("Admin email copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [adminEmail]);

  const handleLogout = useCallback(async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("accesstoken");
      await axios.post(
        `${API_URL}/api/v1/users/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(logout());
      localStorage.removeItem("accesstoken");
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);
      // Force logout client-side anyway
      dispatch(logout());
      localStorage.removeItem("accesstoken");
      navigate("/login");
    }
  }, [dispatch, navigate]);

  // Check if user is still banned by fetching fresh data from server
  useEffect(() => {
    const checkBanStatus = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const token = localStorage.getItem("accesstoken");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`${API_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const latestUser = res.data.user;

          // Update Redux with latest user data
          localStorage.setItem("user", JSON.stringify(latestUser));
          dispatch(setUser(latestUser));

          // If user is no longer banned, redirect to home
          if (latestUser.status !== "banned") {
            navigate("/", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking ban status:", error);
        // If error (like 401), logout
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    checkBanStatus();
  }, [navigate, dispatch, handleLogout]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-red-500/20 max-w-lg w-full rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 text-center"
      >
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <UserX className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
          Account <span className="text-red-500">Suspended</span>
        </h1>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Your privileges on OverClocked have been revoked by an administrator.
          You do not currently have access to our hardware services, purchasing,
          or the seller dashboard.
        </p>

        <div className="bg-black/50 border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
              User ID
            </span>
            <span className="text-white font-mono">
              {user?._id || "Unknown"}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
              Email
            </span>
            <span className="text-white font-medium">
              {user?.email || "Unknown"}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm pt-1">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
              Status
            </span>
            <span className="text-red-500 font-black uppercase tracking-wider text-xs flex items-center gap-1.5 opacity-90">
              <ShieldAlert size={14} /> Banned
            </span>
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-white/5 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            Contact Support
          </h3>
          <p className="text-gray-400 text-xs mb-3">
            Need help or want to appeal? Contact the admin:
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-black/50 border border-white/5 rounded-lg px-4 py-3">
              <p className="text-white font-mono text-sm">{adminEmail}</p>
            </div>
            <button
              onClick={handleCopyEmail}
              className="bg-white/5 hover:bg-white/10 border border-white/5 text-white p-3 rounded-lg transition-colors flex items-center justify-center"
              title="Copy email"
            >
              {copied ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
          >
            Sign Out <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default BannedPage;
