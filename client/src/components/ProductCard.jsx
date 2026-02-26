import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Zap } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
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
      dispatch(removeFromWishlist(product._id));
      toast.info("Removed from Wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to Wishlist");
    }
  };

  const { _id, productName, category, productPrice, discountPercentage, reviews, productImg, inStock = true, isNew = false } = product;

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
      <Link to={`/product/${_id}`} className="relative block h-56 overflow-hidden bg-gray-100 dark:bg-black p-4">
        {displayImage ? (
          <img
            src={displayImage}
            alt={productName}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        {/* Overlay on hover for Quick View effect (optional) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/40 transition-colors duration-300" />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-medium text-sky-500 mb-1">{category}</div>
        <Link to={`/product/${_id}`} className="block mb-2 min-h-[48px]">
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-sky-500 transition-colors">
            {productName}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-4">
          <div className="flex gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">({reviews?.length || 0})</span>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ₹{finalPrice.toLocaleString()}
              </span>
            </div>
            {discountPercentage > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ₹{productPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault(); // prevent navigation trigger
              if (!isAuthenticated) return toast.error("Please login to add to cart");
              dispatch(addToCart({ ...product, quantity: 1, finalPrice }));
              toast.success(`${productName} added to cart!`);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${inStock
              ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500"
              : "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed"
              }`}
            disabled={!inStock}
            title={inStock ? "Add to Cart" : "Out of Stock"}
          >
            <ShoppingCart size={18} className={inStock ? "" : "opacity-50"} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
