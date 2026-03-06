import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);

  return (
    <div className="relative h-screen bg-black text-white overflow-hidden transition-colors duration-300">

      {/* Background Media */}
      <div
        className="absolute inset-0 z-0 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/mann2729/image/upload/v1772775671/half_fmrngu.jpg")' }}
      >
        <video
          src="https://res.cloudinary.com/mann2729/video/upload/v1772777744/full_tlbe7o.mp4"
          poster="https://res.cloudinary.com/mann2729/image/upload/v1772775671/half_fmrngu.jpg"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col justify-center items-center px-4 md:px-0 h-full pt-20">
        <div className="container mx-auto text-center w-full max-w-5xl">
          <div className="mb-6 md:mb-10">
            {user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 backdrop-blur-md"
              >
                <span className="text-sm font-semibold text-blue-300">
                  Welcome back, <span className="text-emerald-400 font-extrabold">{user.firstName}</span>
                </span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-300">
                  OverClocked Live
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tighter mb-8 drop-shadow-2xl"
            >
              LIMITLESS<br />
              <span className="text-blue-500">POWER</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Forge your ultimate machine.
            <span className="block mt-2 font-semibold text-white">
              100% Genuine. Next-Day Delivery. Unmatched Support.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0"
          >
            <button
              onClick={() => navigate("/products")}
              className="group relative w-full sm:w-auto px-4 py-3 bg-transparent/20  backdrop-blur-sm cursor-pointer text-white font-bold text-xl rounded-full transition-all flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.4)]"
            >
              <span className="relative z-10">START BUILDING</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
