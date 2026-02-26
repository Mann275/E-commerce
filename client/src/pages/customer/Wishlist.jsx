import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";
import { HeartCrack, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Wishlist() {
    const { wishlistItems } = useSelector((store) => store.wishlist);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300 pt-24 pb-20">
            {/* Background Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 dark:bg-rose-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-900/20 blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-8 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-500 hover:text-sky-500 dark:text-gray-400 dark:hover:text-sky-400 transition-colors mb-6 font-medium"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </button>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                            My Wishlist
                        </h1>
                        <p className="text-rose-500 font-medium text-lg">
                            Saved items for later.
                        </p>
                    </motion.div>
                </div>

                {wishlistItems?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-950/80 backdrop-blur-md rounded-3xl border border-blue-400/30 dark:border-blue-500/30 shadow-sm">
                        <HeartCrack className="w-20 h-20 text-gray-300 dark:text-neutral-700 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Your Wishlist is Empty
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
                            Looks like you haven't saved any items yet. Start exploring our premium hardware collection!
                        </p>
                        <Link
                            to="/products"
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((product) => (
                            <div key={product._id} className="relative group">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist;
