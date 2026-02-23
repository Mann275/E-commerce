import React from 'react';
import { ArrowRight, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center bg-black">
            {/* Background Image / Glow */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop"
                    alt="Gaming Setup"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-bold mb-6">
                            <Zap className="w-4 h-4 fill-orange-500" />
                            <span>NEXT-GEN PERFORMANCE</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                            FORGE YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">LEGACY</span>
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl mb-8 leading-relaxed font-light">
                            Experience gaming like never before with our elite selection of RTX 40-Series GPUs, mechanical keyboards, and custom liquid-cooled rigs.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/products"
                                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-orange-600/20"
                            >
                                Shop Now <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/about"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg flex items-center justify-center gap-2 border border-white/10 backdrop-blur-sm transition-all"
                            >
                                Learn More
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-12 flex items-center gap-8 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-500" />
                                <span>Official Warranty</span>
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
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        </section>
    );
};

export default Hero;
