import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, SlidersHorizontal, X } from "lucide-react";

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

function FilterSidebar({
  isMobileOpen,
  setIsMobileOpen,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
}) {
  const [expandedSection, setExpandedSection] = useState({
    categories: true,
    price: true,
  });

  const toggleSection = (section) => {
    setExpandedSection((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 500000 });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 sticky top-24 h-[calc(100vh-6rem)] rounded-2xl bg-white dark:bg-zinc-950 border border-blue-400/30 dark:border-blue-500/30 overflow-hidden shadow-sm">
        <div className="w-full h-full flex flex-col pt-4 pb-10 px-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-sky-500">
              <SlidersHorizontal size={20} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
            </div>
            {(selectedCategories.length > 0 ||
              priceRange.max < 500000 ||
              priceRange.min > 0) && (
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-sky-500 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="mb-8 border-b border-blue-400/30 dark:border-blue-500/30 pb-6">
            <button
              onClick={() => toggleSection("categories")}
              className="flex w-full items-center justify-between py-2 text-gray-900 dark:text-white"
            >
              <span className="font-semibold px-1">Categories</span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  expandedSection.categories ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection.categories && (
              <div className="mt-2 space-y-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group px-1 py-1"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-sky-500 border-sky-500"
                            : "border border-gray-300 dark:border-gray-600 group-hover:border-sky-500"
                        }`}
                        onClick={() =>
                          toggleSelection(
                            cat,
                            selectedCategories,
                            setSelectedCategories,
                          )
                        }
                      >
                        {isSelected && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                      <span
                        className={`text-sm transition-colors ${
                          isSelected
                            ? "text-sky-500 font-medium"
                            : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        }`}
                        onClick={() =>
                          toggleSelection(
                            cat,
                            selectedCategories,
                            setSelectedCategories,
                          )
                        }
                      >
                        {cat}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <button
              onClick={() => toggleSection("price")}
              className="flex w-full items-center justify-between py-2 text-gray-900 dark:text-white"
            >
              <span className="font-semibold px-1">Price Range</span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  expandedSection.price ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection.price && (
              <div className="mt-4 px-1">
                {/* Min / Max Inputs */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">
                      Min Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full bg-gray-100 dark:bg-zinc-900 border border-transparent focus:border-sky-500 rounded-lg px-2 py-1.5 text-sm text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <span className="text-gray-400 mt-5">-</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">
                      Max Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full bg-gray-100 dark:bg-zinc-900 border border-transparent focus:border-sky-500 rounded-lg px-2 py-1.5 text-sm text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>₹0</span>
                  <span>₹{priceRange.max.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="500"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      max: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-60 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-75 max-w-[80vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full bg-white dark:bg-zinc-950 shadow-2xl overflow-y-auto z-10">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                {/* Mobile version of the content inside the sheet */}
                <div className="w-full h-full flex flex-col pt-4 pb-10 px-6 overflow-y-auto custom-scrollbar mt-12">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-sky-500">
                      <SlidersHorizontal size={20} />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Filters
                      </h2>
                    </div>
                    {(selectedCategories.length > 0 || priceRange < 500000) && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-gray-500 hover:text-sky-500 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="mb-8 border-b border-blue-400/30 dark:border-blue-500/30 pb-6">
                    <button
                      onClick={() => toggleSection("categories")}
                      className="flex w-full items-center justify-between py-2 text-gray-900 dark:text-white"
                    >
                      <span className="font-semibold px-1">Categories</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          expandedSection.categories ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSection.categories && (
                      <div className="mt-2 space-y-2">
                        {categories.map((cat) => {
                          const isSelected = selectedCategories.includes(cat);
                          return (
                            <label
                              key={cat}
                              className="flex items-center gap-3 cursor-pointer group px-1 py-1"
                            >
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "bg-sky-500 border-sky-500"
                                    : "border border-gray-300 dark:border-gray-600 group-hover:border-sky-500"
                                }`}
                                onClick={() =>
                                  toggleSelection(
                                    cat,
                                    selectedCategories,
                                    setSelectedCategories,
                                  )
                                }
                              >
                                {isSelected && (
                                  <Check size={14} className="text-white" />
                                )}
                              </div>
                              <span
                                className={`text-sm transition-colors ${
                                  isSelected
                                    ? "text-sky-500 font-medium"
                                    : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                }`}
                                onClick={() =>
                                  toggleSelection(
                                    cat,
                                    selectedCategories,
                                    setSelectedCategories,
                                  )
                                }
                              >
                                {cat}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Price Range */}
                  <div className="mb-8">
                    <button
                      onClick={() => toggleSection("price")}
                      className="flex w-full items-center justify-between py-2 text-gray-900 dark:text-white"
                    >
                      <span className="font-semibold px-1">Price Range</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          expandedSection.price ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSection.price && (
                      <div className="mt-4 px-1">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>₹0</span>
                          <span>₹{priceRange.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="500000"
                          step="500"
                          value={priceRange}
                          onChange={(e) =>
                            setPriceRange(Number(e.target.value))
                          }
                          className="w-full accent-sky-500 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FilterSidebar;
