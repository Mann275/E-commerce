import React from "react";
import { ArrowRight, Sparkles, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Hero_overview = () => {
  return (
    <>
      <style>{`
        @keyframes rgbGlow {
          0% {
            box-shadow:
              0 0 10px #ff0000,
              0 0 20px #ff0000,
              0 0 30px #ff0000;
          }
          33% {
            box-shadow:
              0 0 10px #00ff00,
              0 0 20px #00ff00,
              0 0 30px #00ff00;
          }
          66% {
            box-shadow:
              0 0 10px #0000ff,
              0 0 20px #0000ff,
              0 0 30px #0000ff;
          }
          100% {
            box-shadow:
              0 0 10px #ff0000,
              0 0 20px #ff0000,
              0 0 30px #ff0000;
          }
        }
      `}</style>
      <section className="relative h-screen w-full overflow-hidden flex items-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Background Image / Glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-r from-gray-900/90 via-gray-900/50 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1761131828541-33e7b1167cc2?q=75&w=1920&auto=format&fit=crop"
            // src="https://images.unsplash.com/photo-1761131745229-763bffe31248?q=75&w=1920&auto=format&fit=crop"

            alt="Gaming Setup"
            className="w-full h-full object-cover opacity-60"
            loading="eager"
            fetchpriority="high"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-16 md:pt-0">
          <div className="max-w-2xl">
            <div className="animate-fade-in-up">
              <div
                className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/90 backdrop-blur-sm text-white text-sm font-bold mb-6"
                style={{ animation: "rgbGlow 3s ease-in-out infinite" }}
              >
                <Sparkles className="w-4 h-4 fill-white relative z-10" />
                <span className="relative z-10">PREMIUM TECH STORE</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-black dark:text-gray-100 leading-[1.1] mb-6 tracking-tight transition-colors duration-300">
                ELEVATE YOUR <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-blue-600">
                  GAMING WORLD
                </span>
              </h1>

              <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed font-normal">
                Discover premium computer components, cutting-edge gaming gear,
                and powerful setups crafted for champions and creators alike.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-linear-to-r from-sky-700 to-blue-700 hover:from-sky-800 hover:to-blue-800 text-black dark:text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-sky-600/30"
                >
                  Explore Collection <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="https://github.com/Mann275/E-commerce/blob/main/Readme.md"
                  target="_blank"
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-black dark:text-white font-bold rounded-lg flex items-center justify-center gap-2 border-2 border-black dark:border-white transition-all shadow-lg"
                >
                  Discover More
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex items-center gap-8 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Authorized Dealer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
      </section>
    </>
  );
};

export default Hero_overview;
