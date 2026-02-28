import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PackageOpen, Mail, Phone, MapPin, Calendar, ExternalLink, ShieldCheck, Tag } from "lucide-react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import { toast } from "sonner";
import PageLoader from "../../components/PageLoader";

function SellerProfile() {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSellerData = async () => {
            setLoading(true);
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

                if (!id || id === "undefined") {
                    setLoading(false);
                    return;
                }

                // 1. Fetch complete explicit user info (Profile Pic, Phone, Address, etc.)
                let sellerInfo = null;
                try {
                    const userRes = await axios.get(`${API_URL}/api/v1/users/get-user/${id}`);
                    if (userRes.data.success) {
                        setSeller(userRes.data.user);
                        sellerInfo = userRes.data.user;
                    }
                } catch (e) {
                    console.log("Could not fetch explicit user profile, falling back...", e);
                }

                // 2. Fetch products and filter
                const res = await axios.get(`${API_URL}/api/v1/products/getallproducts`);
                if (res.data.success) {
                    const sellerProducts = res.data.products.filter(p => p.status === "active" && p.userId && (p.userId._id === id || p.userId === id));
                    setProducts(sellerProducts);

                    // If explicit user fetch failed, try extracting basic info from product populated fields
                    if (!sellerInfo && sellerProducts.length > 0 && typeof sellerProducts[0].userId === "object") {
                        setSeller(sellerProducts[0].userId);
                    }
                }
            } catch (err) {
                console.error("Error fetching seller data:", err);
                toast.error("Failed to load seller information.");
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [id]);

    if (loading) {
        return <PageLoader />;
    }

    if (!seller && products.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black pt-24 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <PackageOpen className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Not Found</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300 pt-24 pb-20">
            {/* Background Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 dark:bg-emerald-900/20 blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Profile Container */}
                    <div className="w-full lg:w-1/3 xl:w-1/4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm sticky top-24"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full border-4 border-emerald-100 dark:border-emerald-900/30 overflow-hidden mb-4 bg-gray-100 dark:bg-zinc-900 shadow-md">
                                    {seller?.profilePic ? (
                                        <img src={seller.profilePic} alt={seller.firstName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-linear-to-tr from-emerald-500 to-teal-400 text-white text-4xl font-bold">
                                            {seller?.firstName?.charAt(0).toUpperCase() || "S"}
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {seller?.firstName} {seller?.lastName}
                                </h1>
                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full mb-6 flex items-center gap-1">
                                    <ShieldCheck size={14} /> Verified Seller
                                </span>
                            </div>

                            <div className="space-y-4 mb-8">

                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-medium">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                        <Mail size={18} className="text-emerald-500" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-gray-400">Email Address</p>
                                        <p className="truncate text-sm">{(seller?.showEmail === false) ? "Hidden by Seller" : (seller?.email || "Hidden")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-medium">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                        <Phone size={18} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Phone</p>
                                        <p className="text-sm">{(seller?.showPhone === false) ? "Hidden by Seller" : (seller?.phoneNo || "Not provided")}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Products Container */}
                    <div className="w-full lg:w-2/3 xl:w-3/4">
                        <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <PackageOpen className="text-emerald-500" />
                                Products by {seller?.firstName || "this seller"}
                                <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full ml-auto">
                                    {products.length} Items
                                </span>
                            </h2>
                        </div>

                        {products.length === 0 ? (
                            <div className="bg-white dark:bg-zinc-950/50 rounded-3xl p-12 text-center border border-gray-200 dark:border-white/10">
                                <PackageOpen className="w-16 h-16 text-gray-300 dark:text-neutral-700 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Listings</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">This seller does not currently have any products published on the marketplace.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((p) => (
                                    <div key={p._id}>
                                        <ProductCard product={p} />
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}

export default SellerProfile;
