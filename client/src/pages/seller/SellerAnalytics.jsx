import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { BarChart3, PackageOpen, TrendingUp, Star, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

function SellerAnalytics() {
    const { user } = useSelector((store) => store.user);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        revenue: 0,
        products: 0,
        orders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

                // Fetch products to count seller's items
                const prodRes = await axios.get(`${API_URL}/api/v1/products/getallproducts`);
                const sellerProds = prodRes.data.success
                    ? prodRes.data.products.filter(p => p.userId?._id === user._id || p.userId === user._id)
                    : [];

                // Fetch orders for revenue and count
                const orderRes = await axios.get(`${API_URL}/api/v1/orders/seller-orders`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accesstoken")}` }
                });

                const sellerOrders = orderRes.data.success ? orderRes.data.orders : [];
                const totalRevenue = sellerOrders.reduce((acc, order) => {
                    // Only sum items belonging to this seller in the order
                    const sellerItemsTotal = order.items
                        .filter(item => item.sellerId === user._id || item.sellerId?._id === user._id)
                        .reduce((iAcc, item) => iAcc + (item.price * item.quantity), 0);
                    return acc + sellerItemsTotal;
                }, 0);

                setStats({
                    revenue: totalRevenue,
                    products: sellerProds.length,
                    orders: sellerOrders.length
                });
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) fetchDashboardData();
    }, [user]);

    const statItems = [
        { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, trend: "+12.5%", color: "text-sky-500", bg: "bg-sky-500/10", path: "/dashboard" },
        { title: "Active Listings", value: stats.products, icon: PackageOpen, trend: "Live", color: "text-emerald-500", bg: "bg-emerald-500/10", path: "/dashboard/inventory" },
        { title: "Total Orders", value: stats.orders, icon: ShoppingBag, trend: "New", color: "text-indigo-500", bg: "bg-indigo-500/10", path: "/dashboard/orders" },
    ];

    return (
        <div className="animate-fade-in">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-2 uppercase tracking-tighter italic">
                    Performance Hub
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 font-medium">
                    Welcome back, <span className="text-sky-500 font-bold">{user?.firstName}</span>. Your shop is performing well.
                </p>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statItems.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 group overflow-hidden"
                    >
                        <Link
                            to={stat.path}
                            className="block p-5 h-full w-full outline-none focus:bg-gray-50 dark:focus:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-all group-hover:scale-110`}>
                                    <stat.icon size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest">{stat.title}</p>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white tabular-nums tracking-tighter">{stat.value}</h3>
                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${stat.color} ${stat.bg}`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">View Details</span>
                                <TrendingUp size={10} className={`${stat.color} rotate-90`} />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Main Analytics Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 min-h-[450px] relative overflow-hidden group shadow-sm">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Sales Velocity</h2>
                            <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium uppercase tracking-widest">Growth Trends</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-sky-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-gray-400">Live Sync</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center h-[280px] relative z-10">
                        {loading ? (
                            <p className="text-xs font-black text-sky-500 uppercase tracking-widest animate-pulse">Analyzing sales data...</p>
                        ) : (
                            <>
                                <BarChart3 className="w-12 h-12 text-gray-300 dark:text-zinc-800 mb-4" />
                                <p className="text-sm font-black text-gray-400 dark:text-zinc-600 uppercase tracking-[0.2em] italic">Growth metrics synchronized</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-sky-500 to-blue-600 border border-white/5 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl flex flex-col items-center justify-center">
                    <div className="relative z-10 text-center">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h2 className="text-xl font-black uppercase tracking-tighter italic mb-2">Grow Your Shop</h2>
                        <p className="text-xs text-white/70 font-medium leading-relaxed">
                            Maintain high availability and competitive pricing to scale your operations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerAnalytics;
