import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Package, Search, Trash2, Power, Eye, Loader2, Edit } from "lucide-react";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await axios.get(`${API_URL}/api/v1/products/getallproducts`);

            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (error) {
            console.error("Error fetching admin products:", error);
            toast.error("Failed to load global products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to PERMANENTLY delete this product? This overrides seller ownership.")) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const token = localStorage.getItem("accesstoken");

            // Optimistic 
            setProducts(products.filter(p => p._id !== productId));

            const res = await axios.delete(`${API_URL}/api/v1/products/delete/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success("Product scrubbed from platform");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error(error.response?.data?.message || "Failed to delete product");
            fetchProducts();
        }
    };

    // Assuming we have toggleProductStatus working (needs token)
    const handleToggleStatus = async (productId) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const token = localStorage.getItem("accesstoken");

            const res = await axios.put(`${API_URL}/api/v1/products/toggle-status/${productId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setProducts(products.map(p => p._id === productId ? { ...p, status: res.data.status } : p));
            }
        } catch (error) {
            console.error("Toggle failed:", error);
            toast.error(error.response?.data?.message || "Failed to toggle status");
        }
    };

    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <Package size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500 italic">Products</span>
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium tracking-tight">Review and moderate all platform hardware listings.</p>
                    </div>
                </div>

                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-all text-sm font-medium dark:text-white"
                    />
                </div>
            </motion.div>

            <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm overflow-hidden relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-zinc-400 font-medium">Loading inventory matrices...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/10">
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Item Details</th>
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Seller Data</th>
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Metrics</th>
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <motion.tr
                                                key={product._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className={`border-b border-gray-100 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors group ${product.status === 'inactive' ? 'opacity-60 grayscale hover:grayscale-0' : ''}`}
                                            >
                                                <td className="py-4 px-4 min-w-[250px]">
                                                    <div className="flex gap-4">
                                                        <div className="w-14 h-14 bg-white dark:bg-black rounded-xl overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
                                                            {product.productImg?.[0] ? (
                                                                <img src={product.productImg[0].url} alt={product.productName} className="w-full h-full object-contain p-1 mix-blend-multiply dark:mix-blend-normal" />
                                                            ) : (
                                                                <Package size={20} className="text-gray-300" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-500 transition-colors">
                                                                {product.productName}
                                                            </div>
                                                            <div className="text-xs text-gray-500 font-medium mt-0.5">
                                                                {product.category} • {product.brand}
                                                            </div>
                                                            <div className="text-xs text-indigo-500 font-black tracking-widest uppercase mt-1">
                                                                ₹{product.productPrice.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 min-w-[150px]">
                                                    {product.userId ? (
                                                        <div className="flex items-center gap-2">
                                                            {product.userId.profilePic ? (
                                                                <img src={product.userId.profilePic} alt="seller" className="w-6 h-6 rounded-full" />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px] font-bold">
                                                                    {product.userId.firstName?.charAt(0)}
                                                                </div>
                                                            )}
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {product.userId.firstName}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-rose-500 font-bold bg-rose-500/10 px-2 py-1 rounded-md">Orphaned Data</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-md inline-block w-max ${product.quantity > 10 ? 'bg-emerald-500/10 text-emerald-500' :
                                                            product.quantity > 0 ? 'bg-orange-500/10 text-orange-500' :
                                                                'bg-rose-500/10 text-rose-500'
                                                            }`}>
                                                            Stock: {product.quantity}
                                                        </span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md inline-block w-max ${product.status === 'active' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'
                                                            }`}>
                                                            {product.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* Could link to product edit screen built for sellers, but pass param to skip auth block */}
                                                        {/* Just toggling and deleting for rapid moderation */}

                                                        <button
                                                            onClick={() => handleToggleStatus(product._id)}
                                                            className={`p-2 rounded-xl transition-all shadow-sm ${product.status === 'active'
                                                                ? "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-500"
                                                                : "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600"
                                                                }`}
                                                            title={product.status === 'active' ? "Suspend Product" : "Activate Product"}
                                                        >
                                                            <Power size={16} />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteProduct(product._id)}
                                                            className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all shadow-sm"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-gray-500 dark:text-zinc-400 font-medium">
                                                No products found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminProducts;
