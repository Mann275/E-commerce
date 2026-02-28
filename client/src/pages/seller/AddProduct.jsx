import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Plus, Package, CreditCard, Tag, Layers, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
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

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const addUrlImage = () => {
        if (!currentUrl) return toast.error("Please enter a valid URL");
        if (images.length + formData.imageUrls.length >= 6) return toast.error("Maximum 6 images allowed");

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
        if (images.length === 0 && formData.imageUrls.length === 0) return toast.error("Please provide at least one image");

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
            images.forEach(img => data.append("productImg", img.file));

            const res = await axios.post(`${API_URL}/api/v1/products/add-product`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accesstoken")}`
                }
            });

            if (res.data.success) {
                toast.success("Product launched successfully!");
                navigate("/dashboard/inventory");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error(error.response?.data?.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-fade-in p-2">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center sm:text-left"
            >
                <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                    <div className="w-12 h-12 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center">
                        <Plus size={24} />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">
                        Launch New Product
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-zinc-500 font-medium max-w-xl">
                    Deploy high-performance hardware to the OverClocked marketplace. Fill in the technical specifications below.
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Media & Visuals */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            <Upload size={14} /> Product Media
                        </h2>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {/* File Preview */}
                            {images.map((img, idx) => (
                                <div key={`file-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 dark:border-white/5">
                                    <img src={img.preview} alt="preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {/* URL Preview */}
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
                            {images.length + formData.imageUrls.length < 6 && (
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

                        <p className="text-[10px] font-bold text-gray-400 uppercase text-center mt-4">
                            Max 6 high-resolution renders
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black uppercase tracking-tighter italic mb-4">Seller Note</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed font-medium mb-6">
                                Quality images increase conversion by 40%. Ensure your hardware is well-lit and showcased from multiple angles.
                            </p>
                            <div className="flex items-center gap-2 text-sky-400">
                                <CheckCircle2 size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Seller Platform</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
                            <Package size={120} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Configuration Details */}
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
                                        placeholder="e.g. RTX 4090 SUPER"
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
                                        placeholder="e.g. NVIDIA, ASUS"
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
                                        placeholder="Engineered for performance..."
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
                                        placeholder="0"
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
                                            placeholder="00.00"
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
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                            className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-4 pr-10 text-sm font-bold focus:ring-2 focus:ring-sky-500 transition-all dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all flex items-center justify-center gap-3
                                    ${loading
                                        ? "bg-gray-100 dark:bg-zinc-800 text-gray-500 cursor-not-allowed"
                                        : "bg-sky-500 text-white hover:bg-sky-600 hover:scale-[1.01] active:scale-95 shadow-sky-500/25"}
                                `}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                        DEPLOYING TO CLUSTERS...
                                    </>
                                ) : (
                                    <>
                                        LAUNCH PRODUCT
                                        <Tag size={18} />
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

export default AddProduct;
