import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, AlertCircle, Search, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

function MyOrders() {
    const { user } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);
    const cartItemsCount = cartItems?.length || 0;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All Orders");
    const tabs = ["All Orders", "Pending", "Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

    const fetchOrders = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await axios.get(`${API_URL}/api/v1/orders/my-orders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accesstoken")}` }
            });
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
            toast.error("Failed to load your orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await axios.put(`${API_URL}/api/v1/orders/cancel/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accesstoken")}` }
            });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "Pending": return { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Awaiting Confirmation" };
            case "Placed": return { icon: Package, color: "text-sky-500", bg: "bg-sky-500/10", label: "Order Placed" };
            case "Processing": return { icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10", label: "Processing Hardware" };
            case "Shipped": return { icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10", label: "In Transit" };
            case "Delivered": return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Delivered" };
            case "Cancelled": return { icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10", label: "Cancelled" };
            default: return { icon: AlertCircle, color: "text-gray-500", bg: "bg-gray-500/10", label: status };
        }
    };

    const steps = ["Awaiting Confirmation", "Placed", "Processing", "Shipped", "Delivered"];
    const getCurrentStepIndex = (status) => {
        if (status === "Pending") return 0;
        const mappedSteps = ["Pending", "Placed", "Processing", "Shipped", "Delivered"];
        return mappedSteps.indexOf(status);
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-sky-500 font-black animate-pulse uppercase tracking-[0.2em] italic text-xs">Retrieving deployment logs...</div>;

    const filteredOrders = orders.filter(o => {
        const matchesTab = activeTab === "All Orders" || o.orderStatus === activeTab;
        const matchesSearch =
            o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.items.some(item => item.productId?.productName?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen relative bg-slate-50 dark:bg-black transition-colors duration-300 pt-24 pb-20 overflow-hidden">

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-8 mb-10"
                >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                        <div className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                                    My Orders
                                </h1>
                                <p className="text-gray-500 dark:text-zinc-400 font-medium text-lg">
                                    Welcome back, {user?.firstName} {user?.lastName || ''}!
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                {/* Total Orders Card */}
                                <div className="bg-white dark:bg-[#151515] rounded-[1.25rem] p-5 w-full sm:w-[240px] border border-gray-200 dark:border-white/5 shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-[#ea580c] text-white flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                                        <Package size={24} />
                                    </div>
                                    <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 leading-none">
                                        {orders.length}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Orders
                                    </div>
                                </div>

                                {/* Cart Items Card */}
                                <div className="bg-white dark:bg-[#151515] rounded-[1.25rem] p-5 w-full sm:w-[240px] border border-gray-200 dark:border-white/5 shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 leading-none">
                                        {cartItemsCount}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Cart Items
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full lg:w-auto mt-2 lg:mt-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/50 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-sky-500 transition-all dark:text-white w-full lg:w-64 xl:w-80 shadow-sm"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-white/50 dark:bg-black/40 backdrop-blur-md rounded-2xl mb-8 overflow-x-auto no-scrollbar border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all flex items-center gap-2
                                ${activeTab === tab
                                    ? "bg-white dark:bg-zinc-800 text-sky-500 shadow-sm"
                                    : "text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white"}
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)]"
                    >
                        <Package size={64} className="text-sky-500/50 mx-auto mb-6 drop-shadow-lg" />
                        <h3 className="text-2xl font-bold dark:text-white mb-3">No orders found</h3>
                        <p className="text-gray-500 dark:text-zinc-400 mb-8 text-lg">You haven't placed any hardware orders yet.</p>
                        <Link to="/products" className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all inline-block shadow-lg">Start Shopping</Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order, idx) => {
                            const config = getStatusConfig(order.orderStatus);
                            const isExpanded = expandedOrder === order._id;
                            const stepIdx = getCurrentStepIndex(order.orderStatus);

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={order._id}
                                    className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm transition-all group"
                                >
                                    <div className="p-6 md:p-8 relative overflow-hidden">

                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-14 h-14 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center shadow-inner`}>
                                                    <config.icon size={24} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</div>
                                                    <h3 className="text-sm font-bold dark:text-white uppercase">#{order._id.slice(-8)}</h3>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 md:gap-8">
                                                <div className="hidden sm:block">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date</div>
                                                    <div className="text-sm font-bold dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-1">Total Amount</div>
                                                    <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 italic shadow-sm">₹{order.totalAmount.toLocaleString()}</div>
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Tracker */}
                                        {order.orderStatus !== "Cancelled" && (
                                            <div className="mb-8 px-2">
                                                <div className="relative flex justify-between">
                                                    {steps.map((step, idx) => (
                                                        <div key={step} className="flex flex-col items-center relative z-10">
                                                            <div className={`w-6 h-6 rounded-full border-4 transition-all duration-500
                                                                ${idx <= stepIdx
                                                                    ? "bg-sky-500 border-sky-500/20 shadow-lg shadow-sky-500/40"
                                                                    : "bg-gray-200 dark:bg-zinc-800 border-transparent"}
                                                            `} />
                                                            <span className={`text-[8px] font-black uppercase mt-2 tracking-widest
                                                                ${idx <= stepIdx ? "text-sky-500" : "text-gray-400"}
                                                            `}>{step}</span>
                                                        </div>
                                                    ))}
                                                    {/* Progress Line */}
                                                    <div className="absolute top-[11px] left-0 w-full h-0.5 bg-gray-100 dark:bg-zinc-800 -z-0" />
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(stepIdx / (steps.length - 1)) * 100}%` }}
                                                        className="absolute top-[11px] left-0 h-0.5 bg-sky-500 -z-0 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                            <div className="flex items-center gap-2">
                                                {order.items.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 p-1 overflow-hidden shadow-sm group-hover:border-sky-500/30 transition-colors">
                                                        <img src={item.productId?.productImg?.[0]?.url || "https://placeholder.co/40x40"} alt="p" className="w-full h-full object-contain" />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <span className="text-[10px] font-black text-gray-400">+{order.items.length - 3} more</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {["Pending", "Placed"].includes(order.orderStatus) && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-sm"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 transition-all shadow-sm"
                                                >
                                                    {isExpanded ? <><ChevronUp size={16} /> Hide</> : <><ChevronDown size={16} /> Details</>}
                                                </button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-8 space-y-4">
                                                        <div className="bg-gray-50 dark:bg-black rounded-2xl p-6 space-y-4">
                                                            {order.items.map((item, i) => (
                                                                <div key={i} className="flex items-center justify-between gap-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl p-2 border border-gray-100 dark:border-white/10">
                                                                            <img src={item.productId?.productImg?.[0]?.url || "https://placeholder.co/40x40"} alt="p" className="w-full h-full object-contain" />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="text-sm font-bold dark:text-white">{item.productId?.productName}</h4>
                                                                            {item.productId?.userId?.firstName && (
                                                                                <p className="text-[10px] text-sky-500 uppercase font-black tracking-widest mb-1">
                                                                                    Seller: {item.productId.userId.firstName} {item.productId.userId.lastName}
                                                                                </p>
                                                                            )}
                                                                            <p className="text-[10px] text-gray-500 uppercase font-black">Quantity: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-sm font-black dark:text-white italic">₹{(item.price * item.quantity).toLocaleString()}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivering to</h4>
                                                                <p className="text-xs font-bold dark:text-zinc-400 italic">
                                                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                                                                    {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                                                                    {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Payment Channel</h4>
                                                                <div className="flex items-center gap-2 text-xs font-bold dark:text-zinc-400">
                                                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                                                    {order.paymentMethod} (ID: {order._id.slice(0, 8).toUpperCase()})
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
