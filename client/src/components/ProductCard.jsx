import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Zap } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, syncAddToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist, syncAddToWishlist, syncRemoveFromWishlist } from "../redux/wishlistSlice";
import { toast } from "sonner";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  // Gracefully handle undefined/null products to avoid crashing
  if (!product) return null;

  const { isAuthenticated } = useSelector((store) => store.user);
  const { wishlistItems } = useSelector((store) => store.wishlist);

  const isInWishlist = wishlistItems?.some((item) => item._id === product?._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
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

  const { _id, productName, category, productPrice, discountPercentage, reviews, productImg, quantity = 0, isNew = false } = product;
  const isOutOfStock = quantity <= 0;

  // Calculations
  const finalPrice = discountPercentage > 0
    ? productPrice - (productPrice * (discountPercentage / 100))
    : productPrice;

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // Use primary image or fallback
  const displayImage = productImg && productImg.length > 0 ? productImg[0].url : "";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-zinc-950/50 rounded-2xl border border-blue-400/30 dark:border-blue-500/30 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-sky-500/10 dark:hover:border-sky-500/30 transition-all duration-300 flex flex-col h-full"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-1 rounded w-max flex items-center gap-1">
            <Zap size={10} className="fill-white" /> NEW
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded w-max shadow-sm">
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isInWishlist
          ? "bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 opacity-100"
          : "bg-white/80 dark:bg-black/50 text-gray-400 group-hover:text-rose-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          }`}>
        <Heart size={18} className={isInWishlist ? "fill-rose-500" : ""} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${_id}`} className="relative block h-52 overflow-hidden bg-white dark:bg-zinc-900 group">
        <div className="w-full h-full flex items-center justify-center">
          {displayImage ? (
            <img
              src={displayImage}
              alt={productName}
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No Image</div>
          )}
        </div>
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-semibold text-sky-500 mb-1 tracking-wider uppercase">{category}</div>
        <Link to={`/product/${_id}`} className="block mb-2 min-h-[48px]">
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-sky-500 transition-colors leading-tight">
            {productName}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-4">
          <div className="flex gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-700"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">({reviews?.length || 0})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 dark:text-white">
              ₹{finalPrice.toLocaleString()}
            </span>
            {discountPercentage > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                ₹{productPrice.toLocaleString()}
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <div className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-200 dark:border-rose-500/20">
              Out of Stock
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!isAuthenticated) return toast.error("Please login to add to cart");
                const payload = { ...product, quantity: 1, finalPrice };
                dispatch(addToCart(payload));
                dispatch(syncAddToCart(payload));
                toast.success(`${productName} added to cart!`);
              }}
              className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-all duration-300 shadow-lg shadow-sky-500/25 active:scale-95"
              title="Add to Cart"
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
