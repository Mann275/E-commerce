import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { clearCart, syncClearCart } from "../../redux/cartSlice";

function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        email: user?.email || "",
        phone: user?.phoneNo || "",
        address: user?.address || "",
        city: user?.city || "",
        zipCode: user?.pincode || "",
        country: "India"
    });

    const [saveToProfile, setSaveToProfile] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("COD");

    const subtotal = cartItems.reduce((sum, item) => sum + (item.finalPrice || item.productPrice) * item.quantity, 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 50000 ? 0 : 500;
    const total = subtotal + tax + shipping;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
        if (selectedAddressId) setSelectedAddressId(null);
    };

    const handleSelectSavedAddress = (addr) => {
        setSelectedAddressId(addr._id);
        setShippingAddress(prev => ({
            ...prev,
            address: addr.address,
            city: addr.city,
            zipCode: addr.pincode
        }));
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const token = localStorage.getItem("accesstoken");

            // 1. If user checked "Save to Profile", save address info
            if (saveToProfile) {
                if (!selectedAddressId) {
                    await axios.post(`${API_URL}/api/v1/users/address`, {
                        address: shippingAddress.address,
                        city: shippingAddress.city,
                        pincode: shippingAddress.zipCode
                    }, { headers: { Authorization: `Bearer ${token}` } });
                }
            }

            const res = await axios.post(`${API_URL}/api/v1/orders/create`, {
                shippingAddress: {
                    ...shippingAddress,
                    firstName: user?.firstName || "",
                    lastName: user?.lastName || ""
                },
                paymentMethod,
                items: cartItems,
                totalAmount: total
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                if (paymentMethod === "COD") {
                    toast.success("Order placed successfully!");
                    dispatch(clearCart());
                    dispatch(syncClearCart(cartItems));

                    setTimeout(() => {
                        navigate("/my-orders");
                    }, 500);
                } else {
                    // Razorpay Flow
                    const isLoaded = await loadRazorpay();
                    if (!isLoaded) {
                        toast.error("Razorpay SDK failed to load. Check your connection.");
                        setLoading(false);
                        return;
                    }

                    const { razorpayOrder } = res.data;
                    const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YourKeyHere",
                        amount: razorpayOrder.amount,
                        currency: razorpayOrder.currency,
                        name: "OverClocked",
                        description: "Premium Gaming Hardware",
                        order_id: razorpayOrder.id,
                        handler: async (response) => {
                            try {
                                const verifyRes = await axios.post(`${API_URL}/api/v1/orders/verify-payment`, {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                }, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });

                                if (verifyRes.data.success) {
                                    toast.success("Payment successful! Order confirmed.");
                                    dispatch(clearCart());
                                    // Make sure loading goes away before navigating
                                    setLoading(false);
                                    dispatch(syncClearCart(cartItems));

                                    setTimeout(() => {
                                        navigate("/my-orders");
                                    }, 500);
                                }
                            } catch (err) {
                                console.error("Verification failed:", err);
                                setLoading(false);
                                toast.error("Payment verification failed. Please contact support.");
                            }
                        },
                        prefill: {
                            name: `${user?.firstName || "Customer"} ${user?.lastName || ""}`.trim(),
                            email: shippingAddress.email || user?.email || "customer@example.com",
                            contact: shippingAddress.phone || user?.phoneNo || "9999999999"
                        },
                        notes: {
                            address: shippingAddress.address
                        },
                        theme: {
                            color: "#0ea5e9"
                        },
                        modal: {
                            ondismiss: function () {
                                setLoading(false);
                                toast.error("Payment cancelled by user");
                            }
                        }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.on('payment.failed', function (response) {
                        setLoading(false);
                        toast.error("Payment failed. Please try again.");
                    });
                    rzp.open();
                }
            }
        } catch (error) {
            console.error("Order error:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Failed to place order");
        }
    };

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/cart");
        }
    }, [cartItems, navigate]);

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col gap-2 mb-8">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center text-sky-500 hover:text-sky-600 font-bold transition-colors w-max">
                        <ArrowLeft size={20} className="mr-2" /> Back to Cart
                    </button>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Secure <span className="text-sky-500">Checkout</span>
                    </h1>
                </div>

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

                    {/* Left: Forms */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Address */}
                        <div className="bg-white dark:bg-zinc-950 border border-blue-400/30 dark:border-blue-500/30 rounded-3xl p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <MapPin className="text-sky-500" /> Shipping Information
                            </h2>

                            {/* Saved Addresses Section */}
                            {user?.addresses?.length > 0 && (
                                <div className="mb-8">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Use Saved Address</label>
                                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                                        {user.addresses.map((addr) => (
                                            <div
                                                key={addr._id}
                                                onClick={() => handleSelectSavedAddress(addr)}
                                                className={`flex-shrink-0 w-64 p-4 rounded-2xl border-2 transition-all cursor-pointer relative group
                                                    ${selectedAddressId === addr._id
                                                        ? "border-sky-500 bg-sky-500/5 shadow-lg shadow-sky-500/10"
                                                        : "border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-zinc-900/30 hover:border-gray-200 dark:hover:border-white/10"}
                                                `}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-2 h-2 rounded-full ${selectedAddressId === addr._id ? "bg-sky-500 animate-pulse" : "bg-gray-300 dark:bg-zinc-700"}`}></div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Personal Address</span>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{addr.address}</p>
                                                <p className="text-xs text-gray-500 mt-1">{addr.city}, {addr.pincode}</p>
                                            </div>
                                        ))}
                                        <div
                                            onClick={() => { setSelectedAddressId(null); setShippingAddress(prev => ({ ...prev, address: "", city: "", zipCode: "" })); }}
                                            className="flex-shrink-0 w-32 p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-sky-500/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-sky-500 transition-colors">
                                                <ArrowLeft size={16} className="rotate-225" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Add New</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                    <input required type="email" name="email" value={shippingAddress.email} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:border-sky-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                                    <input required name="phone" value={shippingAddress.phone} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:border-sky-500 outline-none" />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Address</label>
                                    <textarea required name="address" value={shippingAddress.address} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:border-sky-500 outline-none h-24 resize-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">City</label>
                                    <input required name="city" value={shippingAddress.city} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:border-sky-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">ZIP Code</label>
                                    <input required name="zipCode" value={shippingAddress.zipCode} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:border-sky-500 outline-none" />
                                </div>
                                <div className="md:col-span-2 mt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group w-max">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={saveToProfile}
                                                onChange={(e) => setSaveToProfile(e.target.checked)}
                                                className="peer sr-only"
                                            />
                                            <div className="w-5 h-5 border-2 border-gray-200 dark:border-white/10 rounded-lg group-hover:border-sky-500/50 transition-all peer-checked:bg-sky-500 peer-checked:border-sky-500"></div>
                                            <svg className="absolute top-0 left-0 w-5 h-5 text-white scale-0 peer-checked:scale-100 transition-transform p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:dark:text-white transition-colors">Save information for future orders</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white dark:bg-zinc-950 border border-blue-400/30 dark:border-blue-500/30 rounded-3xl p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <CreditCard className="text-sky-500" /> Payment Method
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["COD", "Online"].map(method => (
                                    <div
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3
                                            ${paymentMethod === method
                                                ? "border-sky-500 bg-sky-500/5 shadow-lg shadow-sky-500/5 transition-all duration-300"
                                                : "border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10"
                                            }
                                        `}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === method ? "bg-sky-500 text-white" : "bg-gray-100 dark:bg-white/5 text-gray-400"}`}>
                                            {method === "COD" ? <Truck size={24} /> : <CreditCard size={24} />}
                                        </div>
                                        <div className="text-center">
                                            <span className="text-xs font-black uppercase tracking-widest dark:text-white block mb-1">
                                                {method === "COD" ? "Cash on Delivery" : "Online Payment"}
                                            </span>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {method === "COD" ? "Pay when you receive" : "Net Banking, Wallet & UPI"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 sticky top-24 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-2">
                                <ShoppingBag className="text-sky-500" size={20} /> Order Summary
                            </h3>

                            <div className="space-y-3 mb-6 max-h-48 overflow-y-auto no-scrollbar pr-2">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sky-500">x{item.quantity}</span>
                                            <span className="text-gray-600 dark:text-gray-400 truncate max-w-[120px]">{item.productName}</span>
                                        </div>
                                        <span className="font-bold dark:text-white">₹{((item.finalPrice || item.productPrice) * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 mb-6 pt-4 border-t border-gray-100 dark:border-white/5">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                    <span>Tax (18%)</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span className="font-medium text-emerald-500">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between items-end pt-4 border-t border-gray-100 dark:border-white/5">
                                    <span className="text-lg font-black dark:text-white">Amount Due</span>
                                    <span className="text-2xl font-black text-sky-500">₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl flex items-center justify-center gap-3
                                    ${loading
                                        ? "bg-gray-100 dark:bg-zinc-800 text-gray-500 cursor-not-allowed uppercase"
                                        : "bg-zinc-900 dark:bg-white dark:text-black text-white hover:scale-[1.02] active:scale-95 shadow-sky-500/10"}
                                `}
                            >
                                {loading ? "Authorizing..." : "Initialize Order"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Checkout;
