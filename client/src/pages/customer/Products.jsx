import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Search, ChevronDown, PackageOpen } from "lucide-react";
import FilterSidebar from "../../components/FilterSidebar";
import ProductCard from "../../components/ProductCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setLoading, setError } from "../../redux/productSlice";

function Products() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Sidebar Filters State
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });

  // Pagination State
  const [displayCount, setDisplayCount] = useState(9); // Default 9 items per page

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await axios.get(`${API_URL}/api/v1/products/getallproducts`);
        if (res.data.success) {
          dispatch(setProducts(res.data.products));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        dispatch(setError(err.response?.data?.message || err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProducts();
  }, [dispatch]);

  // Apply Client-Side Filtering & Sorting
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(p =>
        p.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Price filter
    result = result.filter(p => {
      const finalPrice = p.discountPercentage > 0
        ? p.productPrice - (p.productPrice * (p.discountPercentage / 100))
        : p.productPrice;
      return finalPrice >= priceRange.min && finalPrice <= priceRange.max;
    });

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => {
        const pA = a.discountPercentage > 0 ? a.productPrice * (1 - a.discountPercentage / 100) : a.productPrice;
        const pB = b.discountPercentage > 0 ? b.productPrice * (1 - b.discountPercentage / 100) : b.productPrice;
        return pA - pB;
      });
    } else if (sortBy === "price-high") {
      result.sort((a, b) => {
        const pA = a.discountPercentage > 0 ? a.productPrice * (1 - a.discountPercentage / 100) : a.productPrice;
        const pB = b.discountPercentage > 0 ? b.productPrice * (1 - b.discountPercentage / 100) : b.productPrice;
        return pB - pA;
      });
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(result);
    setDisplayCount(9); // Reset pagination when filters change
  }, [products, searchQuery, selectedCategories, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300 pt-24 pb-20">

      {/* Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/10 dark:bg-sky-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                Premium Hardware
              </h1>
              <p className="text-sky-600 dark:text-sky-400 font-medium text-lg">
                Build your dream rig with the best components.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Toolbar: Search, Sort & Mobile Filter Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-white dark:bg-zinc-950/80 backdrop-blur-md p-4 rounded-2xl border border-blue-400/30 dark:border-blue-500/30 shadow-sm">
          <div className="flex gap-4 w-full md:w-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors font-medium text-sm w-full sm:w-auto justify-center"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

            {/* Search Bar */}
            <div className="relative flex-1 md:w-80 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:border-sky-500 dark:focus:border-sky-500 text-gray-900 dark:text-white text-sm outline-none transition-all shadow-sm focus:shadow-md"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between sm:justify-end">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
              {loading ? "Loading..." : `Showing ${filteredProducts.length} Results`}
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:border-sky-500 dark:focus:border-sky-500 text-gray-900 dark:text-white text-sm outline-none transition-all cursor-pointer shadow-sm min-w-[140px]"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Main Content: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8 relative items-start">

          {/* Filter Sidebar */}
          <FilterSidebar
            isMobileOpen={isMobileFilterOpen}
            setIsMobileOpen={setIsMobileFilterOpen}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          {/* Product Grid */}
          <div className="flex-1 w-full relative min-h-[100vh]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-20">
                <PackageOpen size={64} className="mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No products found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.slice(0, displayCount).map((product) => (
                  <div key={product._id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length > displayCount && (
              <div className="mt-12 text-center pb-12">
                <button
                  onClick={() => setDisplayCount(prev => prev + 9)}
                  className="px-8 py-3 bg-white dark:bg-zinc-900 border border-blue-400/30 dark:border-blue-500/30 text-gray-900 dark:text-white font-semibold rounded-full hover:border-sky-500 hover:text-sky-500 dark:hover:border-sky-500 dark:hover:text-sky-400 transition-colors shadow-sm relative group overflow-hidden">
                  <span className="relative z-10">Load More Products</span>
                  <div className="absolute inset-0 bg-sky-50 dark:bg-sky-500/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
