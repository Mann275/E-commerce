import React from "react";
import Hero from "../components/Hero_overview";
import FeaturedCategories from "../components/FeaturedCategories";
import {
  Shield,
  Clock,
  Truck,
  Award,
  Cpu,
  TrendingUp,
  Package,
} from "lucide-react";

const Overview = () => {
  return (
    <div className="bg-gray-900 min-h-screen selection:bg-sky-500/30">
      <Hero />

      {/* Infinite Marquee text */}
      <div className="bg-linear-to-r from-sky-900 to-blue-950 overflow-hidden py-3">
        <div className="whitespace-nowrap animate-marquee flex gap-8 font-black text-white italic text-xl uppercase tracking-tighter">
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

      {/* Tech Highlights / Cool Section */}
      <section className="py-32 bg-linear-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-sky-900/20 via-gray-900 to-gray-900 opacity-70"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-6xl font-black text-gray-100 mb-6 leading-tight">
                CRAFT YOUR <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-blue-600">
                  PERFECT SETUP
                </span>
              </h2>
              <p className="text-gray-300 text-lg mb-8">
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
                  className="rounded-3xl border border-gray-700 shadow-2xl shadow-sky-500/20 hover:shadow-sky-500/40 transition-all duration-700"
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
      <section className="py-24 bg-gray-800 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gray-600 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
                className="group p-6 rounded-2xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const TechStat = ({ number, label }) => (
  <div className="border border-gray-700 bg-gray-800/50 p-4 rounded-xl hover:border-sky-500 hover:bg-gray-800 transition-all backdrop-blur-sm">
    <div className="text-3xl font-black text-gray-100 mb-1">{number}</div>
    <div className="text-gray-400 text-xs uppercase tracking-wider font-bold">
      {label}
    </div>
  </div>
);

const TrustCard = ({ icon: Icon, title, desc, delay }) => (
  <div
    className="h-full bg-gray-900/60 border border-gray-700 p-8 rounded-2xl flex flex-col items-center text-center hover:border-sky-500 hover:bg-gray-900 transition-all group animate-fade-in backdrop-blur-sm"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-14 h-14 bg-sky-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-7 h-7 text-sky-500" />
    </div>
    <h3 className="text-xl font-bold text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default Overview;
