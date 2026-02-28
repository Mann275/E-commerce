import React, { useState, useEffect } from "react";
import { ShoppingCart, Package, ExternalLink, Check, X, Truck, Clock, CheckCircle2, Search } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All Orders");
    const [expandedOrder, setExpandedOrder] = useState(null);
    const tabs = ["All Orders", "Pending", "Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

    const fetchOrders = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await axios.get(`${API_URL}/api/v1/orders/seller-orders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accesstoken")}` }
            });
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await axios.put(`${API_URL}/api/v1/orders/status/${orderId}`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accesstoken")}` }
            });

            if (res.data.success) {
                toast.success(`Order status updated to ${newStatus}`);
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesTab = activeTab === "All Orders" || o.orderStatus === activeTab;
        const matchesSearch =
            o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.userId?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.userId?.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) return <div className="flex items-center justify-center h-64 text-sky-500 font-black animate-pulse uppercase tracking-widest text-xs italic">Syncing orders...</div>;

    return (
        <div className="animate-fade-in font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-black dark:text-white">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">Order History</h1>
                    <p className="text-gray-500 dark:text-zinc-500 font-medium text-sm">Track and fulfill customer purchase requests.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl py-1.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-sky-500 transition-all dark:text-white w-64"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl font-black uppercase tracking-widest text-[10px] text-white transition-all hover:scale-105 active:scale-95">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl mb-8 overflow-x-auto no-scrollbar border border-gray-200 dark:border-white/10">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all flex items-center gap-2
                            ${activeTab === tab
                                ? "bg-white dark:bg-zinc-800 text-sky-500 shadow-sm"
                                : "text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white"}
                        `}
                    >
                        {tab}
                        {tab === "Processing" && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto text-black dark:text-white">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <Package className="w-12 h-12 text-gray-200 dark:text-zinc-800 mx-auto mb-4" />
                                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">No orders found</h3>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((o) => (
                                    <React.Fragment key={o._id}>
                                        <tr onClick={() => toggleExpand(o._id)} className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors group cursor-pointer">
                                            <td className="px-6 py-4">
                                                <span className="font-black text-xs text-sky-500 bg-sky-500/10 px-2 py-1 rounded-lg uppercase">#{o._id.slice(-6)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900 dark:text-white font-bold">{o.userId?.firstName} {o.userId?.lastName}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs tabular-nums text-gray-400">
                                                {new Date(o.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${o.orderStatus === 'Cancelled' ? 'bg-rose-500/10 text-rose-500' : 'bg-sky-500/10 text-sky-500'}`}>
                                                    <span className={`w-1 h-1 rounded-full ${o.orderStatus === 'Cancelled' ? 'bg-rose-500' : 'bg-sky-500'} ${o.orderStatus === 'Processing' ? 'animate-pulse' : ''}`} />
                                                    {o.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {o.orderStatus === "Pending" && (
                                                        <>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o._id, "Placed"); }}
                                                                className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"
                                                                title="Accept Order"
                                                            >
                                                                <Check size={14} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o._id, "Cancelled"); }}
                                                                className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                                                                title="Decline Order"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {o.orderStatus === "Placed" && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o._id, "Processing"); }}
                                                            className="px-3 py-1 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                                        >
                                                            Start Processing
                                                        </button>
                                                    )}
                                                    {o.orderStatus === "Processing" && (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o._id, "Placed"); }}
                                                                className="px-3 py-1 bg-gray-500/10 text-gray-500 hover:bg-gray-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                                            >
                                                                Revert
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o._id, "Shipped"); }}
                                                                className="px-3 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                                                            >
                                                                Mark Shipped
                                                            </button>
                                                        </div>
                                                    )}
                                                    {o.orderStatus === "Shipped" && (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o._id, "Processing"); }}
                                                                className="px-3 py-1 bg-gray-500/10 text-gray-500 hover:bg-gray-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                                            >
                                                                Revert
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o._id, "Delivered"); }}
                                                                className="px-3 py-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                                            >
                                                                Mark Delivered
                                                            </button>
                                                        </div>
                                                    )}

                                                    <div className="ml-4 font-black text-gray-900 dark:text-white tabular-nums">
                                                        ₹{o.totalAmount?.toLocaleString()}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedOrder === o._id && (
                                            <tr className="bg-gray-50/30 dark:bg-black/30 w-full border-b border-gray-100 dark:border-white/5">
                                                <td colSpan="5" className="p-0">
                                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
                                                        {/* Shipping & Payment Wrap */}
                                                        <div className="space-y-6">
                                                            <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5 rounded-2xl p-4 shadow-sm">
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-3 flex items-center gap-2">
                                                                    <Truck size={12} /> Contact & Shipping Details
                                                                </h4>
                                                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                                                    <p className="font-bold text-gray-900 dark:text-white flex justify-between">
                                                                        <span>{o.shippingAddress?.firstName || o.userId?.firstName} {o.shippingAddress?.lastName || o.userId?.lastName}</span>
                                                                        <a href={`mailto:${o.shippingAddress?.email}`} className="text-sky-500 text-xs font-medium hover:underline">{o.shippingAddress?.email}</a>
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 pb-2 border-b border-gray-100 dark:border-white/5 mb-2">{o.shippingAddress?.phone}</p>
                                                                    <p>{o.shippingAddress?.address}</p>
                                                                    <p>{o.shippingAddress?.city}, {o.shippingAddress?.zipCode}</p>
                                                                    <p>{o.shippingAddress?.country}</p>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${o.paymentMethod === 'Online' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                                        {o.paymentMethod === 'Online' ? <CheckCircle2 size={18} /> : <ShoppingCart size={18} />}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                                                                            Payment Method
                                                                        </h4>
                                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                                            {o.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {o.transactionId && (
                                                                    <div className="text-right">
                                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">Transaction ID</span>
                                                                        <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">{o.transactionId}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Ordered Items Wrap */}
                                                        <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5 rounded-2xl p-4 shadow-sm">
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-4 flex items-center gap-2">
                                                                <Package size={12} /> Ordered Items ({o.items?.length})
                                                            </h4>
                                                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                                {o.items?.map((item, idx) => (
                                                                    <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-white/[0.02] rounded-xl">
                                                                        <img
                                                                            src={item.productId?.productImg?.[0]?.url || "https://placehold.co/100"}
                                                                            alt={item.productId?.productName}
                                                                            className="w-12 h-12 object-cover rounded-lg bg-white dark:bg-black"
                                                                        />
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.productId?.productName || "Unknown Product"}</p>
                                                                            <div className="flex items-center justify-between mt-1">
                                                                                <span className="text-xs text-gray-500 font-medium">Qty: <span className="text-sky-500 font-bold">{item.quantity}</span></span>
                                                                                <span className="text-sm font-black dark:text-gray-300">₹{(item.price * item.quantity)?.toLocaleString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SellerOrders;
