import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Users, UserCheck, Package, ShoppingCart, DollarSign } from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
                const token = localStorage.getItem("accesstoken");
                const res = await axios.get(`${API_URL}/api/v1/admin/analytics`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    setAnalytics(res.data.analytics);
                }
            } catch (error) {
                console.error("Failed to fetch admin analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="pt-8 relative overflow-hidden">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 mb-10 relative z-10"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500 italic">Overview</span>
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 font-medium tracking-tight">Monitor platform health, users, and overall operations.</p>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-36 bg-gray-200 dark:bg-zinc-800/50 rounded-3xl animate-pulse backdrop-blur-xl border border-white/10" />
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
                >
                    <motion.div variants={itemVariants} onClick={() => navigate('/admin-dashboard/users')} className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 shadow-sm flex items-center gap-6 group hover:border-indigo-500/50 transition-colors cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Users size={28} />
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Users</h3>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{analytics?.totalUsers || 0}</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} onClick={() => navigate('/admin-dashboard/users')} className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 shadow-sm flex items-center gap-6 group hover:border-indigo-500/50 transition-colors cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <UserCheck size={28} />
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Sellers</h3>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{analytics?.totalSellers || 0}</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} onClick={() => navigate('/admin-dashboard/products')} className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 shadow-sm flex items-center gap-6 group hover:border-indigo-500/50 transition-colors cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Package size={28} />
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Products</h3>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{analytics?.totalProducts || 0}</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} onClick={() => navigate('/admin-dashboard/orders')} className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 shadow-sm flex items-center gap-6 group hover:border-indigo-500/50 transition-colors cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 text-fuchsia-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <ShoppingCart size={28} />
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Orders</h3>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{analytics?.totalOrders || 0}</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} onClick={() => navigate('/admin-dashboard/orders')} className="md:col-span-2 lg:col-span-2 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:border-indigo-500/50 transition-colors">
                        <div className="absolute right-[-10%] bottom-[-20%] text-gray-50 dark:text-white/5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                            <DollarSign size={200} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Total Gross Revenue (Delivered)</h3>
                            <p className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                                {formatCurrency(analytics?.totalRevenue || 0)}
                            </p>
                        </div>
                    </motion.div>

                </motion.div>
            )}
        </div>
    );
}

export default AdminDashboard;
