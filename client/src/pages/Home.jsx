import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, Monitor, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";

function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);


  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        setUser(JSON.parse(userString));
      }
    } catch (e) { }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center px-4 md:px-0 pt-24 pb-16 md:pt-32 md:pb-20 mb-10 min-h-[70vh]">
        {/* Simple subtle background accent */}
        <div className="absolute top-0 inset-x-0 h-96 bg-linear-to-b from-blue-500/10 dark:from-blue-600/10 to-transparent pointer-events-none"
        />

        <div className="container mx-auto relative z-10 text-center w-full max-w-5xl">
          <div className="mb-6 md:mb-10">
            {user ? (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 mb-8">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Welcome back, <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{user.firstName}</span>
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 mb-8">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  OverClocked Live
                </span>
              </div>
            )}

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight mb-8">
              <span className="text-gray-900 dark:text-white">LIMITLESS</span>
              <br />
              <span className="text-blue-600 dark:text-blue-400">POWER</span>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Forge your ultimate machine.
            <span className="block mt-2 font-semibold text-gray-800 dark:text-gray-200">
              100% Genuine. Next-Day Delivery. Unmatched Support.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={() => navigate("/products")}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              START BUILDING
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>


    </div>
  );
}

const FeatureBox = ({ icon, title, desc }) => (
  <div className="p-8 bg-gray-50 dark:bg-neutral-950 border border-blue-400 dark:border-neutral-800 rounded-3xl hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-colors">
    <div className="w-16 h-16 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-400 dark:border-neutral-800">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
