import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Heart,
  MessageCircle,
  Package,
  Bell
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/userSlice";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sellerPendingOrders, setSellerPendingOrders] = useState(0);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store
  const { user } = useSelector((store) => store.user);
  const { cartItems } = useSelector((store) => store.cart);
  const { wishlistItems } = useSelector((store) => store.wishlist);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme logic
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      if (mobileMenuOpen && window.scrollY > 10) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  // Close drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Fetch pending orders for seller notification badge
  useEffect(() => {
    const fetchPendingOrders = async () => {
      if (user?.role === 'seller') {
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
          const token = localStorage.getItem("accesstoken");
          if (!token) return;

          const res = await axios.get(`${API_URL}/api/v1/orders/seller-orders`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res.data.success) {
            const pending = res.data.orders.filter(o => o.orderStatus === 'Pending').length;
            setSellerPendingOrders(pending);
          }
        } catch (err) {
          console.error("Failed to fetch seller notifications");
        }
      }
    };
    fetchPendingOrders();

    // Set up polling every 30 seconds for live updates
    let intervalId;
    if (user?.role === 'seller') {
      intervalId = setInterval(fetchPendingOrders, 30000);
    }
    return () => clearInterval(intervalId);
  }, [user]);

  // Logout function
  const accessToken = localStorage.getItem("accesstoken");
  const handleLogout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await axios.post(
        `${API_URL}/api/v1/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Logged out successfully");
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        localStorage.removeItem("user");
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Still logout on frontend even if API fails
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");
      localStorage.removeItem("user");
      dispatch(logout());
      navigate("/");
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-black/40 dark:bg-black/60 backdrop-blur-3xl border-b border-blue-400 dark:border-white/10 shadow-sm py-2"
        : "bg-transparent py-2"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 md:h-14 gap-2">
          {/* LEFT: Logo Section */}
          <Link to="/" className="flex items-center gap-1.5 group shrink-0">
            <img
              src="https://res.cloudinary.com/mann2729/image/upload/v1772097164/logo_xdduls.png"
              alt="Logo"
              className="w-7 h-7 md:w-8 md:h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-transform group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="text-xl md:text-2xl font-black tracking-tight flex items-center">
              <span className="text-black     dark:text-white">Over</span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-green-500 to-blue-500 bg-size[200%_auto] animate-gradient-x font-black ml-px">
                Clocked
              </span>
            </span>
          </Link>

          {/* CENTER: Desktop Nav Links (Capsule Design) */}
          <nav className="hidden lg:flex flex-1 justify-center items-center">
            <div className="flex items-center gap-1 p-1 bg-white/70 dark:bg-neutral-900/70 border border-blue-400 dark:border-neutral-800 rounded-full shadow-sm backdrop-blur-md">
              <NavLink to="/" current={location.pathname === "/"}>
                Home
              </NavLink>
              {(!user || user.role === "customer") && (
                <NavLink
                  to="/products"
                  current={location.pathname.toLowerCase() === "/products"}
                >
                  Products
                </NavLink>
              )}
              {user?.role === "seller" && (
                <div className="relative">
                  <NavLink
                    to="/dashboard"
                    current={location.pathname.toLowerCase() === "/dashboard"}
                  >
                    Dashboard
                  </NavLink>

                </div>
              )}
              {user?.role === "admin" && (
                <NavLink
                  to="/admin-dashboard"
                  current={location.pathname.startsWith("/admin-dashboard")}
                >
                  Admin Panel
                </NavLink>
              )}
            </div>
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex justify-end items-center gap-2 md:gap-4 shrink-0">
            {/* Seller Notifications */}
            {user?.role === "seller" && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-1.5 md:p-2 rounded-full text-gray-700 hover:text-black hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors mr-1 md:mr-2"
                >
                  <Bell className="w-5 h-5 md:w-5 md:h-5" />
                  {sellerPendingOrders > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-sm border border-white dark:border-black">
                      {sellerPendingOrders}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white dark:bg-[#1A1A1A] border border-blue-400 dark:border-neutral-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Notifications</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-sky-500 bg-sky-500/10 px-2 py-1 rounded-md">{sellerPendingOrders} New</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto no-scrollbar">
                      {sellerPendingOrders > 0 ? (
                        <Link
                          to="/dashboard/orders"
                          onClick={() => setNotificationOpen(false)}
                          className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-gray-50 dark:border-neutral-800/50 last:border-0"
                        >
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                              <Package size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">You have {sellerPendingOrders} pending order{sellerPendingOrders > 1 ? 's' : ''} waiting for your acceptance or rejection.</p>
                              <p className="text-xs text-sky-500 font-bold mt-1">Click to view orders</p>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-sm font-medium">All caught up!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 md:p-2 rounded-full text-black hover:text-black hover:bg-gray-200 dark:text-white dark:hover:text-white dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 md:w-5 md:h-5" />
              ) : (
                <Moon className="w-5 h-5 md:w-5 md:h-5" />
              )}
            </button>

            {/* Wishlist */}
            {user?.role === "customer" && (
              <Link
                to="/wishlist"
                className="relative p-1.5 md:p-2 rounded-full text-gray-700 hover:text-rose-500 hover:bg-rose-50 dark:text-gray-300 dark:hover:text-rose-500 dark:hover:bg-rose-500/10 transition-colors w-10 h-10 flex items-center justify-center mr-1 md:mr-2 group"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 md:w-5 md:h-5 group-hover:fill-rose-500/20 transition-all" />
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-white dark:border-black shadow-sm">
                  {wishlistItems?.length || 0}
                </span>
              </Link>
            )}

            {/* Cart - Only visible when logged in */}
            {user?.role === "customer" && (
              <Link
                to="/cart"
                className="relative p-1.5 md:p-2 rounded-full text-gray-700 hover:text-black hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors mr-2 w-10 h-10 flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 md:w-5 md:h-5" />
                <span className="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-white dark:border-black shadow-sm">
                  {cartItems?.length || 0}
                </span>
              </Link>
            )}

            {/* Auth / Profile Area */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/70 dark:bg-neutral-900/70 border border-blue-400 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-all focus:outline-none backdrop-blur-md"
                  >
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        loading="lazy"
                        className="w-7 h-7 rounded-full object-cover bg-gray-200 dark:bg-zinc-800"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-linear-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-inner shadow-black/20">
                        {user.firstName?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-black dark:text-gray-200 max-w-25 truncate underline decoration-blue-500 decoration-1 underline-offset-4">
                      {user.firstName}
                      <div className={`text-[10px] uppercase font-bold tracking-widest mt-0.5 ${user.role === 'seller' ? 'text-emerald-500 [text-shadow:0_0_10px_rgba(16,185,129,0.8)]' : 'text-sky-500 [text-shadow:0_0_10px_rgba(14,165,233,0.8)]'}`}>
                        {user.role}
                      </div>
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1A1A1A] border border-blue-400 dark:border-neutral-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-200">
                      <Link
                        to={`/profile/${user._id}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" /> My Profile
                      </Link>
                      {user?.role === "customer" && (
                        <Link
                          to="/my-orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                      )}
                      {user?.role === "admin" && (
                        <Link
                          to="/admin-dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <Package className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <div className="h-px bg-gray-200 dark:bg-neutral-800 my-1"></div>
                      <button
                        onClick={() => {
                          if (window.confirm("Really want to logout?")) {
                            handleLogout();
                          }
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="relative group px-5 py-2 font-bold texk:black dark:text-white rounded-full overflow-hidden shadow-lg"
                  >
                    <div className="absolute inset-0 bg-linear-to-r  from-sky-500/20 to-blue-600 transition-transform group-hover:scale-105"></div>
                    <span className="relative z-10">Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="relative group px-5 py-2 font-bold texk:black dark:text-white rounded-full overflow-hidden shadow-lg"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-sky-700/20 to-blue-600 transition-transform group-hover:scale-105"></div>
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-full text-black dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-black/95 border-b border-blue-400 dark:border-neutral-800 shadow-xl overflow-y-auto max-h-[80vh] flex flex-col backdrop-blur-3xl animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 flex flex-col gap-2">
            <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            {user?.role === "seller" ? (
              <MobileNavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </MobileNavLink>
            ) : user?.role === "admin" ? (
              <MobileNavLink
                to="/admin-dashboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </MobileNavLink>
            ) : (
              <MobileNavLink
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </MobileNavLink>
            )}
          </div>

          <div className="p-4 border-t border-blue-400 dark:border-neutral-900 bg-gray-50 dark:bg-neutral-950/50 mt-auto">
            {user ? (
              <div className="flex flex-col gap-3">
                <Link
                  to={`/profile/${user._id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 mb-2 px-2 hover:bg-gray-100 dark:hover:bg-neutral-900 p-2 rounded-xl transition-colors cursor-pointer"
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-zinc-800 border border-blue-400"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-inner shadow-black/20 border border-blue-400/50">
                      {user.firstName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white capitalize underline decoration-blue-500 decoration-1 underline-offset-4">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className={`text-[10px] uppercase font-bold tracking-widest mt-0.5 ${user.role === 'seller' ? 'text-emerald-500 [text-shadow:0_0_10px_rgba(16,185,129,0.8)]' : 'text-sky-500 [text-shadow:0_0_10px_rgba(14,165,233,0.8)]'}`}>
                      {user.role}
                    </div>
                    <div className="text-xs text-blue-500 font-semibold truncate max-w-50 mt-1">
                      {user.email}
                    </div>
                  </div>
                </Link>
                {user?.role === "customer" && (
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-white dark:bg-neutral-900 border border-blue-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
                  >
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                )}
                <button
                  onClick={() => {
                    if (window.confirm("Really want to logout?")) {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-gray-500 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 text-black dark:text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-[#0970e7] hover:bg-[#0479ff] text-black dark:text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// NavLink for Desktop
const NavLink = ({ to, children, current }) => (
  <Link
    to={to}
    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${current
      ? "bg-white dark:bg-[#2A2A2A] text-black dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-none"
      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5"
      }`}
  >
    {children}
  </Link>
);

// NavLink for Mobile
const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;
