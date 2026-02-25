import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Cpu, Gamepad2 } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  let user = null;
  try {
    const userString = localStorage.getItem("user");
    user = userString ? JSON.parse(userString) : null;
  } catch (e) { }

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen transition-colors duration-300">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-0">
        {/* Advanced Dynamic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-300/20 via-white to-white dark:from-sky-900/20 dark:via-black dark:to-black transition-colors duration-300" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 brightness-100 contrast-150 mix-blend-overlay transition-opacity duration-300"></div>

        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 dark:bg-sky-600/20 rounded-full blur-[100px] animate-blob pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000 pointer-events-none"></div>

        <div className="container mx-auto relative z-10 text-center animate-fade-in-up">
          <div className="mb-8">
            {user ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-colors">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Welcome back, <span className="text-gray-900 dark:text-white font-bold">{user.name}</span></span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-colors">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">OverClocked Live</span>
              </div>
            )}

            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.9] tracking-tighter mb-6 relative group">
              <span className="inline-block relative z-10 text-gray-900 dark:text-white transition-colors duration-300">LIMITLESS</span>
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-blue-600 pb-2 pr-2">
                POWER
              </span>
              {/* Glitch Effect Duplicate */}
              <span className="absolute top-0 left-0 w-full h-full text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-blue-600 opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-300 pointer-events-none" aria-hidden="true">
                LIMITLESS<br />POWER
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Forge your ultimate machine.
            <span className="text-gray-900 dark:text-white font-semibold transition-colors"> 100% Genuine Parts.</span>
            <span className="text-gray-900 dark:text-white font-semibold transition-colors"> Fast Delivery.</span>
            <span className="text-gray-900 dark:text-white font-semibold transition-colors"> Unmatched Support.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={() => navigate('/products')}
              className="group relative px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-lg rounded-full overflow-hidden hover:scale-105 transition-transform shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white dark:group-hover:text-white transition-colors duration-300">
                SHOP NOW
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-sky-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>

        {/* Parallax Floating Elements (simulated without framer-motion) */}
        <div className="absolute top-32 right-[10%] opacity-20 md:opacity-100 animate-bounce-slow pointer-events-none">
          <Cpu className="w-24 h-24 md:w-32 md:h-32 text-sky-500 mix-blend-multiply dark:mix-blend-screen" />
        </div>
        <div className="absolute bottom-32 left-[10%] opacity-20 md:opacity-100 animate-bounce-slow-reverse pointer-events-none">
          <Gamepad2 className="w-32 h-32 md:w-40 md:h-40 text-blue-500 mix-blend-multiply dark:mix-blend-screen" />
        </div>

        <style>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(-5%) rotate(12deg); }
            50% { transform: translateY(5%) rotate(15deg); }
          }
          @keyframes bounce-slow-reverse {
            0%, 100% { transform: translateY(5%) rotate(-12deg); }
            50% { transform: translateY(-5%) rotate(-15deg); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 7s ease-in-out infinite;
          }
          .animate-bounce-slow-reverse {
            animation: bounce-slow-reverse 8s ease-in-out infinite;
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
      </section>
    </div>
  );
}

export default Home;
