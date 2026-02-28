import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, Plus, Package, CreditCard, Tag, Layers, CheckCircle2, Save, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [images, setImages] = useState([]); // Standard for new uploads
    const [existingImages, setExistingImages] = useState([]); // To track what to keep
    const [formData, setFormData] = useState({
        productName: "",
        productDesc: "",
        productPrice: "",
        category: "",
        brand: "",
        quantity: "",
        discountPercentage: 0,
        imageUrls: [], // Array of links
    });
    const [currentUrl, setCurrentUrl] = useState("");

    const categories = [
        "GPU",
        "CPU / Processor",
        "Motherboard",
        "RAM",
        "Storage (SSD/HDD)",
        "Power Supply",
        "Cabinet",
        "Cooling (Liquid/Air)",
    ];

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
                const res = await axios.get(`${API_URL}/api/v1/products/get/${productId}`);
                if (res.data.success) {
                    const p = res.data.product;
                    setFormData({
                        productName: p.productName || "",
                        productDesc: p.productDesc || "",
                        productPrice: p.productPrice || "",
                        category: p.category || "",
                        brand: p.brand || "",
                        quantity: p.quantity || "",
                        discountPercentage: p.discountPercentage || 0,
                        imageUrls: [],
                    });
                    setExistingImages(p.productImg || []);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product details");
                navigate("/dashboard/inventory");
            } finally {
                setFetching(false);
            }
        };

        if (productId) fetchProductData();
    }, [productId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (public_id) => {
        setExistingImages(prev => prev.filter(img => img.public_id !== public_id));
    };

    const addUrlImage = () => {
        if (!currentUrl) return toast.error("Please enter a valid URL");
        if (images.length + existingImages.length + formData.imageUrls.length >= 6) return toast.error("Maximum 6 images allowed");

        setFormData(prev => ({
            ...prev,
            imageUrls: [...prev.imageUrls, currentUrl]
        }));
        setCurrentUrl("");
    };

    const removeUrl = (index) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0 && existingImages.length === 0 && formData.imageUrls.length === 0) {
            return toast.error("Please provide at least one image");
        }

        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const data = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === "imageUrls") {
                    formData.imageUrls.forEach(url => data.append("imageUrls", url));
                } else {
                    data.append(key, formData[key]);
                }
            });

            // Append public_ids of images to keep
            existingImages.forEach(img => data.append("existingImages", img.public_id));

            // Append new files
            images.forEach(img => data.append("productImg", img.file));

            const res = await axios.put(`${API_URL}/api/v1/products/update/${productId}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accesstoken")}`
                }
            });

            if (res.data.success) {
                toast.success("Product updated successfully!");
                navigate("/dashboard/inventory");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error(error.response?.data?.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex items-center justify-center h-64 text-sky-500 font-black animate-pulse uppercase tracking-widest text-xs italic">Retrieving product specs...</div>;

    return (
        <div className="max-w-5xl mx-auto animate-fade-in p-2">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center sm:text-left"
            >
                <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                    <button
                        onClick={() => navigate("/dashboard/inventory")}
                        className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-sky-500 rounded-xl transition-all"
                    >
                        <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <div className="w-12 h-12 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center">
                        <Package size={24} />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">
                        Edit Specification
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-zinc-500 font-medium max-w-xl">
                    Update the technical configurations and marketplace data for your hardware.
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Media */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            <Upload size={14} /> Product Media
                        </h2>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {/* Existing Images */}
                            {existingImages.map((img, idx) => (
                                <div key={`old-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 dark:border-white/5">
                                    <img src={img.url} alt="existing" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(img.public_id)}
                                        className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {/* New Previews */}
                            {images.map((img, idx) => (
                                <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden group border border-sky-500/30">
                                    <img src={img.preview} alt="preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-sky-500 text-[8px] font-black text-white rounded-md uppercase">New</div>
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {/* URL Previews */}
                            {formData.imageUrls.map((url, idx) => (
                                <div key={`url-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden group border border-sky-500/30">
                                    <img src={url} alt="url preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-sky-500 text-[8px] font-black text-white rounded-md uppercase">Link</div>
                                    <button
                                        type="button"
                                        onClick={() => removeUrl(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {images.length + existingImages.length + formData.imageUrls.length < 6 && (
                                <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-sky-500/5 transition-all group">
                                    <Plus className="text-gray-400 group-hover:text-sky-500" size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-sky-500 mt-2">Add Slot</span>
                                    <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                                </label>
                            )}
                        </div>

                        {/* Image Link Input */}
                        <div className="mt-6 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                                <Plus size={12} /> Add via Link
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    name="currentUrl"
                                    value={currentUrl}
                                    onChange={(e) => setCurrentUrl(e.target.value)}
                                    placeholder="https://example.com/hardware.jpg"
                                    className="flex-1 bg-gray-50 dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-sky-500 transition-all dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={addUrlImage}
                                    className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Fields */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                                <Package size={14} /> Basic Specification
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Product Name</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-sky-500 transition-all dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Brand</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-sky-500 transition-all dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Description</label>
                                    <textarea
                                        name="productDesc"
                                        value={formData.productDesc}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-sky-500 transition-all dark:text-white resize-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2 border-t border-gray-100 dark:border-white/5 pt-8">
                                <Layers size={14} /> Classification & Inventory
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-sky-500 transition-all dark:text-white cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Stock Units</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-sky-500 transition-all dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2 border-t border-gray-100 dark:border-white/5 pt-8">
                                <CreditCard size={14} /> Pricing Architecture
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Base Price (INR)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            name="productPrice"
                                            value={formData.productPrice}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-4 pl-8 text-sm font-bold focus:ring-2 focus:ring-sky-500 transition-all dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Discount (%)</label>
                                    <div className="relative">
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                        <input
                                            type="number"
                                            name="discountPercentage"
                                            value={formData.discountPercentage}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                            className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-4 pr-10 text-sm font-bold focus:ring-2 focus:ring-sky-500 transition-all dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard/inventory")}
                                className="flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-[2] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all flex items-center justify-center gap-3
                                    ${loading
                                        ? "bg-gray-100 dark:bg-zinc-800 text-gray-500 cursor-not-allowed"
                                        : "bg-sky-500 text-white hover:bg-sky-600 hover:scale-[1.01] active:scale-95 shadow-sky-500/25"}
                                `}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                        UPDATING SPEC...
                                    </>
                                ) : (
                                    <>
                                        SAVE CHANGES
                                        <Save size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditProduct;
