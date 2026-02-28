import React from "react";
import { useSelector } from "react-redux";
import { BarChart3, PackageOpen, MessageCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

function SellerDashboard() {
    const { user } = useSelector((store) => store.user);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300 pt-24 pb-20">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8">
                    Dashboard, <span className="text-sky-500">{user?.firstName}</span>
                </h1>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Total Sales", value: "₹0", icon: TrendingUp, color: "text-emerald-500" },
                        { title: "Active Products", value: "0", icon: PackageOpen, color: "text-sky-500" },
                        { title: "Total Orders", value: "0", icon: BarChart3, color: "text-indigo-500" },
                        { title: "Messages", value: "0", icon: MessageCircle, color: "text-rose-500" },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex items-center justify-between"
                        >
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Coming Soon Section */}
                <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center shadow-sm">
                    <TrendingUp className="w-16 h-16 text-gray-300 dark:text-neutral-700 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Detailed Analytics Coming Soon</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        This is a placeholder for your XYZ Seller Dashboard. In the future, you will manage products, edit inventory, and fulfill orders directly from here.
                    </p>
                </div>

            </div>
        </div>
    );
}

export default SellerDashboard;
