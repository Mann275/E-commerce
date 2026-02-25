import React from "react";
import Hero_overview from "../components/Hero_overview";
import FeaturedCategories from "../components/FeaturedCategories";
import { Cpu, TrendingUp, Package } from "lucide-react";

const Overview = () => {
  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen selection:bg-sky-500/30 transition-colors duration-300 relative overflow-x-hidden">
      {/* Dynamic Glow Background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-200/40 via-white to-white dark:from-sky-900/20 dark:via-black dark:to-black"></div>

      <div className="relative z-10">
        <Hero_overview />

        {/* CSS for custom RGB glowing line animation */}
        <style>{`
          @keyframes rgbLineGlow {
            0%, 100% { box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000; background-color: #ff0000; }
            33% { box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00; background-color: #00ff00; }
            66% { box-shadow: 0 0 10px #0000ff, 0 0 20px #0000ff; background-color: #0000ff; }
          }
          .animate-rgb-line {
            animation: rgbLineGlow 5s linear infinite;
            mask-image: linear-gradient(to right, transparent, black 2%, black 98%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 2%, black 98%, transparent);
          }
        `}</style>

        {/* Infinite Marquee text */}
        <div className="bg-linear-to-r from-sky-900 to-blue-950 dark:from-sky-900 dark:to-blue-950 overflow-hidden py-3 transition-colors duration-300">
          <div className="whitespace-nowrap animate-marquee flex gap-8 font-black text-black dark:text-white italic text-xl uppercase tracking-tighter">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="flex items-center gap-4">
                Top Tier Components <TrendingUp className="w-5 h-5" /> Premium
                Quality <Package className="w-5 h-5" /> Latest Technology{" "}
                <Cpu className="w-5 h-5" /> Fast Delivery
              </span>
            ))}
          </div>
        </div>

        <FeaturedCategories />

        <div className="w-full flex justify-center relative z-20 opacity-80 py-2">
          <div className="h-1 w-full animate-rgb-line"></div>
        </div>

        {/* Tech Highlights / Cool Section */}
        <section className="pt-24 pb-16 relative transition-colors duration-300 flex flex-col items-center">
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-in">
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-gray-100 mb-6 leading-tight transition-colors">
                  CRAFT YOUR <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-blue-600 pr-2 pb-1">
                    PERFECT SETUP
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 transition-colors">
                  From streamers to developers, gamers to designers—our curated
                  selection of premium hardware empowers every type of creator.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <TechStat number="1000+" label="Products Available" />
                  <TechStat number="2-3d" label="Delivery Time" />
                  <TechStat number="4.9★" label="Average Rating" />
                  <TechStat number="100%" label="Authentic Parts" />
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1000"
                    alt="RGB CPU"
                    className="rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl shadow-sky-500/20 hover:shadow-sky-500/40 transition-all duration-700"
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-500 blur-[100px] opacity-25" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600 blur-[100px] opacity-25" />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Premium Trust Section */}

        <section className="py-24 relative transition-colors duration-300 flex flex-col items-center">
          <div className="absolute top-0 w-full flex justify-center opacity-80 py-2">
            <div className="h-1 w-full animate-rgb-line"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 text-center mt-20 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">
              WHY CHOOSE{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-blue-600 pr-2 pb-1">
                OVERCLOCKED ?
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-medium italic">
              "Built by gamers, for gamers. We don't just sell hardware; we fuel
              your passion for peak performance."
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mt-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🎮",
                  title: "Gaming Focused",
                  desc: "Built by gamers, for gamers. Every product is curated for the gaming community.",
                },
                {
                  icon: "💰",
                  title: "Best Prices",
                  desc: "Compare prices from multiple sellers and get the best deals on every purchase.",
                },
                {
                  icon: "🔒",
                  title: "Buyer Protection",
                  desc: "100% secure payments with buyer protection on every transaction.",
                },
                {
                  icon: "🚀",
                  title: "Fast Delivery",
                  desc: "Get your products delivered fast with our verified shipping partners.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative p-6 rounded-2xl bg-white/80 dark:bg-gray-900/40 border border-sky-900/60
 dark:border-sky-800/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:border-sky-400/50 dark:hover:border-sky-500/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-4xl mb-4 relative z-10">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="h-1 w-full animate-rgb-line"></div>
      </div>
    </div>
  );
};

const TechStat = ({ number, label }) => (
  <div
    className="border border-sky-900/60
 dark:border-sky-800/50 bg-white/80 dark:bg-gray-900/40 p-4 rounded-xl hover:border-sky-400/60 dark:hover:border-sky-500/60 hover:bg-white dark:hover:bg-gray-900/80 transition-all backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)]"
  >
    <div className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-1 transition-colors">
      {number}
    </div>
    <div className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold transition-colors">
      {label}
    </div>
  </div>
);

export default Overview;
