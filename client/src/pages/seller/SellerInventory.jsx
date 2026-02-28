import React, { useState, useEffect } from "react";
import { Package, Plus, Search, Filter, MoreHorizontal, LayoutGrid, List, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

function SellerInventory() {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("newest");

    const fetchSellerProducts = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await axios.get(`${API_URL}/api/v1/products/getallproducts`);
            if (res.data.success) {
                // Return all products for the seller (including inactive ones)
                const sellerProducts = res.data.products.filter(
                    (p) => p.userId?._id === user._id || p.userId === user._id
                );
                setProducts(sellerProducts);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) fetchSellerProducts();
    }, [user, user?._id]);

    const handleStatusToggle = async (productId) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await axios.put(`${API_URL}/api/v1/products/toggle-status/${productId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accesstoken")}`
                }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setProducts(prev => prev.map(p =>
                    p._id === productId ? { ...p, status: res.data.status } : p
                ));
            }
        } catch (error) {
            console.error("Status toggle failed:", error);
            toast.error("Failed to update status");
        }
    };

    const filteredProducts = products.filter(p =>
        p.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "price-low") return a.productPrice - b.productPrice;
        if (sortBy === "price-high") return b.productPrice - a.productPrice;
        if (sortBy === "stock-low") return a.quantity - b.quantity;
        if (sortBy === "stock-high") return b.quantity - a.quantity;
        return 0;
    });

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to remove this product from inventory?")) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await axios.delete(`${API_URL}/api/v1/products/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accesstoken")}`
                }
            });

            if (res.data.success) {
                toast.success("Product removed successfully");
                setProducts(prev => prev.filter(p => p._id !== productId));
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64 text-sky-500 font-black animate-pulse uppercase tracking-widest text-xs italic">Loading shop inventory...</div>;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Shop Inventory</h1>
                    <p className="text-gray-500 dark:text-zinc-500 font-medium text-sm">Manage and track your listed components.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate("/dashboard/add-product")}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white dark:text-black rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus size={16} /> Add New Product
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, brand, category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-sky-500 transition-all dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort By:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl py-2 px-4 text-xs font-bold outline-none focus:border-sky-500 transition-all dark:text-white cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="stock-low">Stock: Low to High</option>
                            <option value="stock-high">Stock: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.01]">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Price</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Stock</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                                <tr key={p._id} className={`group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors ${p.status === 'inactive' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/5">
                                                <img src={p.productImg?.[0]?.url || "https://placehold.co/40x40?text=No+Image"} alt={p.productName} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{p.productName}</p>
                                                <p className="text-xs text-gray-500 dark:text-zinc-500 line-clamp-1">{p.brand}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">₹{p.productPrice?.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-zinc-500">{p.quantity}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${p.status === 'inactive' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            {p.status === 'inactive' ? 'Closed' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleStatusToggle(p._id)}
                                                className={`p-2 rounded-lg bg-gray-50 dark:bg-white/5 transition-all
                                                    ${p.status === 'inactive'
                                                        ? 'text-rose-500 hover:bg-emerald-500/10 hover:text-emerald-500'
                                                        : 'text-emerald-500 hover:bg-rose-500/10 hover:text-rose-500'}
                                                `}
                                                title={p.status === 'inactive' ? "Activate Listing" : "Deactivate Listing"}
                                            >
                                                {p.status === 'inactive' ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                            <Link
                                                to={`/dashboard/edit-product/${p._id}`}
                                                className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-sky-500 hover:bg-sky-500/10 transition-all"
                                                title="Edit Product"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-zinc-500 uppercase font-black tracking-widest text-xs">
                                        No assets deployed to inventory yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SellerInventory;
