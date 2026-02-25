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
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/userSlice";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/40 dark:bg-black/60 backdrop-blur-3xl border-b border-gray-200 dark:border-white/10 shadow-sm py-2"
          : "bg-transparent py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 md:h-14 gap-2">
          {/* LEFT: Logo Section */}
          <Link to="/" className="flex items-center gap-1.5 group shrink-0">
            <img
              src="/logo.png"
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
            <div className="flex items-center gap-1 p-1 bg-white/70 dark:bg-neutral-900/70 border border-gray-200 dark:border-neutral-800 rounded-full shadow-sm backdrop-blur-md">
              <NavLink to="/" current={location.pathname === "/"}>
                Home
              </NavLink>
              <NavLink
                to="/products"
                current={location.pathname.toLowerCase() === "/products"}
              >
                Products
              </NavLink>
              {user && (
                <NavLink
                  to="/profile"
                  current={location.pathname === "/profile"}
                >
                  Profile
                </NavLink>
              )}
            </div>
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex justify-end items-center gap-2 md:gap-4 shrink-0">
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

            {/* Cart - Only visible when logged in */}
            {user && (
              <Link
                to="/cart"
                className="relative p-1.5 md:p-2 rounded-full text-gray-700 hover:text-black hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors mr-2"
              >
                <ShoppingCart className="w-5 h-5 md:w-5 md:h-5" />
                <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white dark:border-black">
                  0
                </span>
              </Link>
            )}

            {/* Auth / Profile Area */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/70 dark:bg-neutral-900/70 border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-all focus:outline-none backdrop-blur-md"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-7 h-7 rounded-full object-cover bg-gray-200 dark:bg-zinc-800"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 max-w-25 truncate">
                      {user.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-200">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" /> My Profile
                      </Link>
                      <div className="h-px bg-gray-200 dark:bg-neutral-800 my-1"></div>
                      <button
                        onClick={handleLogout}
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black/90  border-b border-gray-200 dark:border-neutral-800 shadow-xl overflow-y-auto max-h-[80vh] flex flex-col">
          <div className="p-4 flex flex-col gap-2">
            <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </MobileNavLink>
            {user && (
              <MobileNavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </MobileNavLink>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-neutral-900 bg-gray-50 dark:bg-neutral-950/50 mt-auto">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-2 px-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-zinc-800"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Logged in
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
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
    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
      current
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
