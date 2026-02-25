import { ShoppingCart, Menu, X, Sun, Moon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function Navbar() {
  const [user] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Theme logic
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header className="bg-gray-950/80 backdrop-blur-xl fixed w-full z-20 border-b border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="OverClocked Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-lg font-bold text-white hidden sm:block">
              Over<span className="text-sky-400">Clocked</span>
            </span>
          </Link>

          {/* Desktop Nav Section */}
          <nav className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-1">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/Products">Products</NavLink>
              {user && <NavLink to="/profile">Profile</NavLink>}
            </ul>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-300 hover:text-sky-400 transition-colors rounded-lg hover:bg-gray-800"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <Link
                to="/cart"
                className="relative p-2 text-gray-300 hover:text-sky-400 transition-colors rounded-lg hover:bg-gray-800"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 bg-sky-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>

              {user ? (
                <Button className="bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-4 py-1.5 rounded-lg cursor-pointer text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25">
                  Logout
                </Button>
              ) : (
                <Button className="bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-4 py-1.5 rounded-lg cursor-pointer text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25">
                  Login
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-300 hover:text-sky-400 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <Link to="/cart" className="relative p-2 text-gray-300">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-sky-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-sky-400 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 bg-gray-950/95 backdrop-blur-xl w-full absolute left-0 px-4">
            <ul className="flex flex-col gap-2">
              <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink
                to="/Products"
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
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-800">
              {user ? (
                <Button className="w-full bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white py-2 rounded-lg">
                  Logout
                </Button>
              ) : (
                <Button className="w-full bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white py-2 rounded-lg">
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="px-3 py-1.5 text-gray-300 hover:text-sky-400 font-medium text-sm transition-colors duration-200 rounded-lg hover:bg-gray-800"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-gray-300 hover:text-sky-400 hover:bg-gray-800 rounded-lg transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;
