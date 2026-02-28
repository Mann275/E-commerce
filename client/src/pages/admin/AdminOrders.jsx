import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { ShoppingCart, Search, View, Edit, PackageCheck, Truck, Clock, XCircle, Loader2, X, MapPin, CreditCard, User, Mail, Phone, Calendar } from "lucide-react";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusUpdating, setStatusUpdating] = useState(null);
    const [viewOrder, setViewOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const token = localStorage.getItem("accesstoken");
            const res = await axios.get(`${API_URL}/api/v1/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (error) {
            console.error("Error fetching global orders:", error);
            toast.error("Failed to load global orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // We can use the existing seller logic for updating status, bypassing the seller check server-side if admin
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setStatusUpdating(orderId);
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const token = localStorage.getItem("accesstoken");

            // Optimistic 
            setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));

            const res = await axios.put(`${API_URL}/api/v1/orders/status/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success(`Order transitioned to ${newStatus}`);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error(error.response?.data?.message || "Failed to update order status");
            fetchOrders(); // Revert
        } finally {
            setStatusUpdating(null);
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            "Pending": "bg-orange-500/10 text-orange-500 border-orange-500/20",
            "Shipped": "bg-blue-500/10 text-blue-500 border-blue-500/20",
            "Delivered": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            "Cancelled": "bg-rose-500/10 text-rose-500 border-rose-500/20"
        };
        const icons = {
            "Pending": <Clock size={12} className="mr-1" />,
            "Shipped": <Truck size={12} className="mr-1" />,
            "Delivered": <PackageCheck size={12} className="mr-1" />,
            "Cancelled": <XCircle size={12} className="mr-1" />
        };
        const colorClass = colors[status] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${colorClass}`}>
                {icons[status] || null}
                {status}
            </span>
        );
    };

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-8 relative overflow-hidden min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 relative z-10"
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                        <ShoppingCart size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500 italic">Orders</span>
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium tracking-tight">Oversee platform-wide logistics and transactions.</p>
                    </div>
                </div>

                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by ID or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-all text-sm font-medium dark:text-white"
                    />
                </div>
            </motion.div>

            <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm overflow-hidden relative z-10 w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-zinc-400 font-medium">Loading transaction matrix...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/10">
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Transaction</th>
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Telemetry Status</th>
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <motion.tr
                                                key={order._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className={`border-b border-gray-100 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors group ${order.orderStatus === 'Cancelled' ? 'opacity-60 grayscale hover:grayscale-0' : ''}`}
                                            >
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-mono text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                                                            #{order._id.slice(-8).toUpperCase()}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                        <p className="text-xs text-indigo-500 font-medium mt-0.5">
                                                            {order.items?.length || 0} Items
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {order.userId ? (
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white capitalize text-sm">
                                                                {order.userId.firstName} {order.userId.lastName}
                                                            </p>
                                                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                                {order.userId.email}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-rose-500 font-bold bg-rose-500/10 px-2 py-1 rounded-md">Guest / Deleted</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="font-black text-gray-900 dark:text-white">
                                                        ₹{order.totalAmount?.toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col gap-2 items-start">
                                                        <StatusBadge status={order.orderStatus} />

                                                        <select
                                                            value={order.orderStatus}
                                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                            disabled={statusUpdating === order._id || order.orderStatus === 'Cancelled' || order.orderStatus === 'Delivered'}
                                                            className="text-[10px] font-bold uppercase tracking-widest rounded-md px-2 py-1 border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer outline-none transition-all shadow-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <option value="Pending" className="text-gray-900 bg-white">Set: Pending</option>
                                                            <option value="Shipped" className="text-gray-900 bg-white">Set: Shipped</option>
                                                            <option value="Delivered" className="text-gray-900 bg-white">Set: Delivered</option>
                                                            <option value="Cancelled" className="text-gray-900 bg-white">Set: Cancelled</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-500 hover:border-indigo-500/30 transition-all shadow-sm ml-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                                                        onClick={() => setViewOrder(order)}
                                                    >
                                                        <View size={14} /> View
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-gray-500 dark:text-zinc-400 font-medium">
                                                No orders found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Order Modal */}
            <AnimatePresence>
                {viewOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/50">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                                        <PackageCheck className="text-indigo-500" size={28} />
                                        Order Details
                                    </h2>
                                    <p className="text-sm font-bold text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-widest">
                                        Transaction <span className="text-indigo-500">#{viewOrder._id.slice(-8)}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setViewOrder(null)}
                                    className="p-3 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-rose-500 hover:border-rose-500 transition-all shadow-sm group"
                                >
                                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                                    {/* Customer Info */}
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 dark:bg-zinc-900/30 rounded-2xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                                                <User size={14} className="text-indigo-500" /> Customer Information
                                            </h3>
                                            <div className="space-y-3 relative z-10">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                                        <User size={16} className="text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Name</p>
                                                        <p className="text-sm font-bold dark:text-white capitalize">
                                                            {viewOrder.userId?.firstName || viewOrder.shippingAddress?.firstName || "N/A"}{" "}
                                                            {viewOrder.userId?.lastName || viewOrder.shippingAddress?.lastName || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                                        <Mail size={16} className="text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Email Address</p>
                                                        <p className="text-sm font-bold dark:text-white">{viewOrder.userId?.email || viewOrder.shippingAddress?.email || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                                        <Phone size={16} className="text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Phone</p>
                                                        <p className="text-sm font-bold dark:text-white">{viewOrder.shippingAddress?.phone || viewOrder.shippingAddress?.contact || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Meta */}
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 dark:bg-zinc-900/30 rounded-2xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                                                <MapPin size={14} className="text-emerald-500" /> Shipping & Logistics
                                            </h3>
                                            <div className="space-y-3 relative z-10">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                                        <MapPin size={16} className="text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Destination</p>
                                                        <p className="text-sm font-bold dark:text-zinc-300">
                                                            {viewOrder.shippingAddress?.address}<br />
                                                            {viewOrder.shippingAddress?.city}, {viewOrder.shippingAddress?.zipCode || viewOrder.shippingAddress?.pincode}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                                        <CreditCard size={16} className="text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Payment Gateway</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md text-[10px] font-black uppercase tracking-widest">
                                                                {viewOrder.paymentMethod || "COD"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                                        <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Transaction Time</p>
                                                        <p className="text-sm font-bold dark:text-zinc-300">
                                                            {new Date(viewOrder.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Container */}
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                                        <ShoppingCart size={14} className="text-indigo-500" /> Purchased Hardware
                                    </h3>
                                    <div className="border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                                        {viewOrder.items?.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50/50 dark:bg-zinc-900/30 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-white dark:hover:bg-black transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 p-1 flex items-center justify-center overflow-hidden shrink-0">
                                                        <img
                                                            src={item.productId?.productImg?.[0]?.url || "https://placeholder.co/60x60"}
                                                            alt={item.productId?.productName || "Product"}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.productId?.productName || "Unknown Product"}</h4>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mt-1">
                                                            Qty: <span className="text-indigo-500">{item.quantity}</span> &times; ₹{item.price?.toLocaleString() || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 sm:mt-0 text-right w-full sm:w-auto">
                                                    <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500 italic">
                                                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Total Summary Row */}
                                        <div className="bg-gray-100 dark:bg-white/5 p-4 flex justify-between items-center sm:text-lg border-t-2 border-dashed border-gray-200 dark:border-white/10">
                                            <span className="font-black uppercase tracking-widest text-xs text-gray-500 dark:text-gray-400">Total Charged</span>
                                            <span className="font-black text-indigo-500 text-xl tracking-tight">₹{viewOrder.totalAmount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminOrders;
