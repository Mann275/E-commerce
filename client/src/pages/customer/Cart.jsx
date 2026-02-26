import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowRight, ArrowLeft, ShieldCheck, CreditCard, Lock } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity as updateCartQuantity, removeFromCart } from "../../redux/cartSlice";

function Cart() {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateCartQuantity({ id, quantity: newQuantity }));
    };

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    // Use finalPrice if available, else fallback to standard price
    const subtotal = cartItems.reduce((sum, item) => sum + (item.finalPrice || item.productPrice) * item.quantity, 0);
    const tax = subtotal * 0.18; // 18% GST example
    const shipping = subtotal > 50000 ? 0 : 500;
    const total = subtotal + tax + shipping;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col gap-2 mb-8">
                    <Link to="/products" className="inline-flex items-center text-sky-500 hover:text-sky-600 font-bold transition-colors w-max">
                        <ArrowLeft size={20} className="mr-2" /> Continue Shopping
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Shopping <span className="text-sky-500">Cart</span>
                    </h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-950 border border-blue-400/30 dark:border-blue-500/30 rounded-3xl shadow-sm">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={40} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            Looks like you haven't added any premium components to your cart yet. Let's get you building!
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-sky-500/25"
                        >
                            Start Shopping <ArrowRight size={20} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={item._id}
                                        className="bg-white dark:bg-zinc-950 border border-blue-400/30 dark:border-blue-500/30 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-full sm:w-32 aspect-square bg-gray-50 dark:bg-black rounded-xl p-2 flex-shrink-0">
                                            <img src={item.productImg && item.productImg.length > 0 ? item.productImg[0].url : "https://via.placeholder.com/400"} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                        </div>

                                        <div className="flex-1 w-full text-center sm:text-left">
                                            <div className="text-xs font-bold text-sky-500 mb-1 tracking-wider uppercase">{item.category}</div>
                                            <Link to={`/product/${item._id}`} className="hover:text-sky-500 transition-colors">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{item.productName}</h3>
                                            </Link>
                                            <div className="text-sky-600 dark:text-sky-400 font-bold text-xl mb-4 sm:hidden">
                                                ₹{((item.finalPrice || item.productPrice) * item.quantity).toLocaleString()}
                                            </div>

                                            <div className="flex items-center justify-center sm:justify-start gap-6">
                                                <div className="flex items-center border border-blue-400/30 dark:border-blue-500/30 rounded-lg bg-gray-50 dark:bg-black">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                        className="px-3 py-1 hover:text-sky-500 text-gray-500 font-bold transition-colors"
                                                    >-</button>
                                                    <span className="px-3 py-1 font-semibold text-gray-900 dark:text-white min-w-[3ch] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                        className="px-3 py-1 hover:text-sky-500 text-gray-500 font-bold transition-colors"
                                                    >+</button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    className="text-gray-400 hover:text-rose-500 transition-colors flex items-center gap-1 text-sm font-medium"
                                                >
                                                    <Trash2 size={16} /> Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="hidden sm:block text-right">
                                            <div className="text-2xl font-black text-gray-900 dark:text-white">
                                                ₹{((item.finalPrice || item.productPrice) * item.quantity).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                ₹{(item.finalPrice || item.productPrice).toLocaleString()} each
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 sticky top-24 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
                                    Order Summary
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span className="font-medium text-gray-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Estimated Tax (18%)</span>
                                        <span className="font-medium text-gray-900 dark:text-white">₹{tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Shipping</span>
                                        {shipping === 0 ? (
                                            <span className="font-medium text-emerald-500">Free</span>
                                        ) : (
                                            <span className="font-medium text-gray-900 dark:text-white">₹{shipping.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-white/10 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                        <span className="text-3xl font-black text-sky-500">₹{total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-sky-500/25 mb-6 relative group overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Proceed to Checkout <ArrowRight size={20} />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
                                </button>

                                {/* Trust Badges */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <Lock size={18} className="text-emerald-500" /> Secure Checkout
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <ShieldCheck size={18} className="text-sky-500" /> Buyer Protection Guarantee
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <CreditCard size={18} className="text-indigo-500" /> All Major Cards Accepted
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
