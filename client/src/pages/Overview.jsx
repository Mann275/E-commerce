import React, { Suspense, lazy } from "react";
import { Shield, Clock, Truck, Award, Cpu, Zap } from "lucide-react";

// Lazy load heavy components
const Hero = lazy(() => import("../components/Hero"));
const FeaturedCategories = lazy(
  () => import("../components/FeaturedCategories"),
);

const Overview = () => {
  const ComponentLoader = () => (
    <div className="w-full py-20 flex justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen selection:bg-orange-500/30">
      <Suspense fallback={<ComponentLoader />}>
        <Hero />
      </Suspense>

      {/* Infinite Marquee text */}
      <div className="bg-orange-600 overflow-hidden py-3">
        <div className="whitespace-nowrap animate-marquee flex gap-8 font-black text-black italic text-xl uppercase tracking-tighter">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-4">
              Next Gen Performance <Zap className="w-5 h-5 fill-black" />{" "}
              Ultimate Gaming <Cpu className="w-5 h-5" />
            </span>
          ))}
        </div>
      </div>

      <Suspense fallback={<ComponentLoader />}>
        <FeaturedCategories />
      </Suspense>

      {/* Tech Highlights / Cool Section */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-orange-900/10 via-black to-black opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                BUILD YOUR <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-500">
                  DREAM MACHINE
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Whether you're a professional esports athlete or a content
                creator, we have the hardware to match your ambition.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <TechStat number="500+" label="RTX 4090s Sold" />
                <TechStat number="24h" label="Avg Ship Time" />
                <TechStat number="99%" label="Customer Satisfaction" />
                <TechStat number="24/7" label="Expert Support" />
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1000"
                  alt="Gaming PC"
                  className="rounded-3xl border border-orange-500/20 shadow-2xl shadow-orange-500/10 grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 blur-[100px] opacity-20" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 blur-[100px] opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Premium Trust Section */}
      <section className="py-24 bg-zinc-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TrustCard
              icon={Shield}
              title="Official Warranty"
              desc="Direct manufacturer guarantees on all parts."
              delay={0.1}
            />
            <TrustCard
              icon={Truck}
              title="Fast Shipping"
              desc="Next-day delivery available for metro areas."
              delay={0.2}
            />
            <TrustCard
              icon={Clock}
              title="24/7 Support"
              desc="Expert technical assistance whenever you need it."
              delay={0.3}
            />
            <TrustCard
              icon={Award}
              title="Price Match"
              desc="We won't be beaten on price for official stock."
              delay={0.4}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const TechStat = ({ number, label }) => (
  <div className="border border-white/10 bg-white/5 p-4 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
    <div className="text-3xl font-black text-white mb-1">{number}</div>
    <div className="text-gray-500 text-xs uppercase tracking-wider font-bold">
      {label}
    </div>
  </div>
);

const TrustCard = ({ icon: Icon, title, desc, delay }) => (
  <div
    className="h-full bg-black/40 backdrop-blur-sm border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-all group animate-fade-in"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-7 h-7 text-orange-500" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default Overview;
