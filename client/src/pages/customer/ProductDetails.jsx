import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, ChevronRight, Send, User } from "lucide-react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { setLoading, setSingleProduct, setError } from "../../redux/productSlice";
import { addToCart, syncAddToCart } from "../../redux/cartSlice";
import { addToWishlist, removeFromWishlist, syncAddToWishlist, syncRemoveFromWishlist } from "../../redux/wishlistSlice";
import PageLoader from "../../components/PageLoader";

function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { singleProduct: product, loading } = useSelector((state) => state.product);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            dispatch(setLoading(true));
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
                const res = await axios.get(`${API_URL}/api/v1/products/get/${id}`);
                if (res.data.success) {
                    dispatch(setSingleProduct(res.data.product));
                }
            } catch (error) {
                console.error(error);
                dispatch(setError(error.message));
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchProduct();
    }, [id, dispatch]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!rating || !comment.trim()) return toast.error("Rating and comment are required");

        setIsSubmittingReview(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const token = localStorage.getItem("accesstoken");
            const res = await axios.post(
                `${API_URL}/api/v1/products/${id}/review`,
                { rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success("Review added successfully!");
                dispatch(setSingleProduct(res.data.product)); // Update state with new review
                setComment("");
                setRating(5);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (loading || !product) {
        return <PageLoader />;
    }

    const discountPercentage = product.discountPercentage || 0;
    const finalPrice = discountPercentage > 0
        ? product.productPrice - (product.productPrice * (discountPercentage / 100))
        : product.productPrice;

    const isInWishlist = wishlistItems?.some((item) => item._id === product?._id);

    const toggleWishlist = () => {
        if (!isAuthenticated) return toast.error("Please login to add to Wishlist");

        if (isInWishlist) {
            // Optimistic update
            dispatch(removeFromWishlist(product));
            // Async sync
            dispatch(syncRemoveFromWishlist(product));
            toast.info("Removed from Wishlist");
        } else {
            // Optimistic update
            dispatch(addToWishlist(product));
            // Async sync
            dispatch(syncAddToWishlist(product));
            toast.success("Added to Wishlist");
        }
    };

    const averageRating = product.reviews && product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    const displayImages = product.productImg && product.productImg.length > 0
        ? product.productImg
        : [{ url: "https://via.placeholder.com/800" }]; // fallback

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
                    <Link to="/" className="hover:text-sky-500 transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/products" className="hover:text-sky-500 transition-colors">Products</Link>
                    <ChevronRight size={14} />
                    <span className="hover:text-sky-500 transition-colors cursor-pointer">{product.category}</span>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-none">{product.productName}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Image Gallery Column */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl p-8 aspect-square flex items-center justify-center relative shadow-sm overflow-hidden group"
                        >
                            <img
                                src={displayImages[activeImage]?.url}
                                alt={product.productName}
                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-110 transition-transform duration-500"
                            />
                        </motion.div>

                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-4 gap-4">
                            {displayImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`bg-white dark:bg-zinc-950 border rounded-2xl p-2 aspect-square flex items-center justify-center overflow-hidden transition-all duration-300 ${activeImage === idx
                                        ? "border-sky-500 ring-2 ring-sky-500/20"
                                        : "border-gray-200 dark:border-white/10 hover:border-sky-500/50"
                                        }`}
                                >
                                    <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sky-500 font-semibold">{product.category} &bull; {product.brand}</div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                            {product.productName}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/20">
                                <Star size={16} className="fill-amber-400 text-amber-400" />
                                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{averageRating.toFixed(1)}</span>
                            </div>
                            <a href="#reviews" className="text-sm text-gray-500 hover:text-sky-500 underline decoration-dashed cursor-pointer transition-colors">
                                Read {product.reviews?.length || 0} Reviews
                            </a>
                        </div>

                        {/* Price section */}
                        <div className="mb-6 p-6 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                                    ₹{finalPrice.toLocaleString()}
                                </span>
                                {discountPercentage > 0 && (
                                    <span className="text-lg text-gray-500 line-through font-medium mb-1">
                                        ₹{product.productPrice.toLocaleString()}
                                    </span>
                                )}
                                {discountPercentage > 0 && (
                                    <span className="text-sm font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded mb-1 ml-auto">
                                        {discountPercentage}% OFF
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${product.quantity > 0
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full ${product.quantity > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></div>
                                    {product.quantity > 0 ? `In Stock (${product.quantity})` : "Out of Stock"}
                                </div>
                                <span className="text-gray-400 text-sm">SKU: OC-{product._id?.slice(-6).toUpperCase()}</span>
                            </div>

                        </div>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">
                            {product.productDesc}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-gray-200 dark:border-white/10">
                            <div className="flex items-center justify-between border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-black px-4 py-2 w-full sm:w-32 h-14">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-gray-500 hover:text-sky-500 text-xl font-bold px-2 transition-colors"
                                >
                                    -
                                </button>
                                <span className="font-bold text-gray-900 dark:text-white">{quantity}</span>
                                <button
                                    onClick={() => {
                                        if (quantity >= product.quantity) {
                                            toast.warning(`Only ${product.quantity} units available in stock.`);
                                        } else {
                                            setQuantity(quantity + 1);
                                        }
                                    }}
                                    className="text-gray-500 hover:text-sky-500 text-xl font-bold px-2 transition-colors"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    if (!product || product.quantity <= 0) {
                                        return toast.warning(`${product?.productName || 'Product'} is out of stock`);
                                    }
                                    if (!isAuthenticated) {
                                        return toast.error("Please login to add items to your cart");
                                    }
                                    const payload = { ...product, quantity, finalPrice };
                                    // Optimistic update
                                    dispatch(addToCart(payload));
                                    // Async sync
                                    dispatch(syncAddToCart(payload));
                                    toast.success(`${quantity}x ${product.productName} added to cart!`);
                                }}
                                disabled={product?.quantity <= 0}
                                className={`flex-1 h-14 font-black rounded-xl flex items-center justify-center gap-2 transition-all relative overflow-hidden group ${product?.quantity > 0
                                    ? "bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25 active:scale-95"
                                    : "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed border border-dashed border-gray-300 dark:border-white/10"
                                    }`}
                            >
                                <span className="relative z-10 flex items-center gap-2 tracking-widest uppercase text-sm">
                                    <ShoppingCart size={20} /> {product?.quantity > 0 ? "Add to Cart" : "Item Unavailable"}
                                </span>
                                {product?.quantity > 0 && <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 z-0"></div>}
                            </button>

                            <button
                                onClick={(e) => {
                                    if (!isAuthenticated) {
                                        return toast.error("Please login to add items to your wishlist");
                                    }
                                    toggleWishlist(e);
                                }}
                                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors border ${isInWishlist
                                    ? "bg-rose-50 text-rose-500 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20"
                                    : "bg-white dark:bg-black border-gray-200 dark:border-white/10 text-gray-400 hover:text-rose-500"
                                    }`}
                                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                <Heart size={24} className={isInWishlist ? "fill-rose-500" : ""} />
                            </button>
                        </div>

                        {/* Features/Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-transparent text-center gap-2">
                                <Truck className="text-sky-500" size={24} />
                                <div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">Free Delivery</div>
                                    <div className="text-xs text-gray-500">On orders above ₹50k</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-transparent text-center gap-2">
                                <ShieldCheck className="text-sky-500" size={24} />
                                <div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">Warranty</div>
                                    <div className="text-xs text-gray-500">3 Years Brand Warranty</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-transparent text-center gap-2">
                                <RotateCcw className="text-sky-500" size={24} />
                                <div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">Return Policy</div>
                                    <div className="text-xs text-gray-500">7 Days Replacement</div>
                                </div>
                            </div>
                        </div>

                        {/* Specification Table */}
                        <div className="bg-white dark:bg-zinc-950 border border-blue-400/30 dark:border-blue-500/30 rounded-2xl overflow-hidden shadow-sm p-6 mb-8">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">About this item</h3>
                                {product.userId && (
                                    <Link to={`/sellerinfo/${product.userId?._id || product.userId}`} className="flex items-center gap-2 text-sm bg-sky-50 hover:bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
                                        <User size={16} /> View Seller
                                    </Link>
                                )}
                            </div>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>Seller: {product.userId?.firstName} {product.userId?.lastName}</li>
                                <li>Brand: {product.brand}</li>
                                <li>Category: {product.category}</li>
                            </ul>
                        </div>

                    </motion.div>
                </div>

                {/* Reviews Section */}
                <div id="reviews" className="mt-20 border-t border-blue-400/30 dark:border-blue-500/30 pt-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Customer Reviews</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Add Review Panel */}
                        <div className="lg:col-span-1">
                            {isAuthenticated ? (
                                <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-blue-400/30 dark:border-blue-500/30 shadow-sm sticky top-24">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Write a Review</h3>
                                    <form onSubmit={handleAddReview} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className="focus:outline-none"
                                                    >
                                                        <Star
                                                            size={24}
                                                            className={star <= rating ? "fill-amber-400 text-amber-400 stroke-none" : "text-gray-300 dark:text-gray-600"}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                                            <textarea
                                                rows={4}
                                                className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-sky-500 focus:border-sky-500 p-3 text-sm"
                                                placeholder="Share your experience with this product..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingReview}
                                            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {isSubmittingReview ? "Submitting..." : <><Send size={16} /> Submit Review</>}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-200 dark:border-white/10 text-center">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Have this product?</h3>
                                    <p className="text-gray-500 text-sm mb-6">Login to share your thoughts with the community.</p>
                                    <Link to="/login" className="inline-block px-6 py-2 bg-sky-500 text-white font-bold rounded-full transition-colors hover:bg-sky-600">
                                        Login to Review
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Review List */}
                        <div className="lg:col-span-2 space-y-6">
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.slice().reverse().map((review, idx) => (
                                    <div key={idx} className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row gap-4">
                                        <div>
                                            {review.userId?.profilePic ? (
                                                <img src={review.userId.profilePic} alt="User" className="w-12 h-12 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-linear-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                                                    {review.userId?.firstName?.charAt(0) || "U"}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-bold text-gray-900 dark:text-white capitalize">
                                                    {review.userId?.firstName} {review.userId?.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex text-amber-400 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < review.rating ? "fill-amber-400 stroke-none" : "text-gray-300 dark:text-gray-700"} />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                                    <Star size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4 opacity-50" />
                                    <p className="font-medium">No reviews yet.</p>
                                    <p className="text-sm">Be the first to review {product.productName}!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
