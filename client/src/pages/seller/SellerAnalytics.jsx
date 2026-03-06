import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  BarChart3,
  PackageOpen,
  TrendingUp,
  Star,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "../../api/axiosInstance";

function SellerAnalytics() {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    revenue: 0,
    products: 0,
    orders: 0,
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch products to count seller's items
        const prodRes = await apiClient.get(`/products/getallproducts`);
        const sellerProds = prodRes.data.success
          ? prodRes.data.products.filter(
            (p) => p.userId?._id === user._id || p.userId === user._id,
          )
          : [];

        // Filter low stock items (below 5)
        const lowStock = sellerProds.filter(p => p.quantity < 5);
        setLowStockItems(lowStock);

        // Fetch orders for revenue and count
        const orderRes = await apiClient.get(`/orders/seller-orders`);
        const sellerOrders = orderRes.data.success ? orderRes.data.orders : [];

        // Calculate Revenue and Sales Velocity (7 Days)
        let totalRevenue = 0;
        const dailyRevenue = {};

        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          dailyRevenue[dateStr] = 0;
        }

        sellerOrders.forEach((order) => {
          if (order.orderStatus === "Cancelled" || order.orderStatus === "Failed") return;

          const dateStr = new Date(order.createdAt).toISOString().split('T')[0];

          const sellerItemsTotal = order.items
            .filter(item => (item.sellerId?._id || item.sellerId) === user._id)
            .reduce((iAcc, item) => iAcc + item.price * item.quantity, 0);

          totalRevenue += sellerItemsTotal;
          if (dailyRevenue[dateStr] !== undefined) {
            dailyRevenue[dateStr] += sellerItemsTotal;
          }
        });

        const formattedSalesData = Object.keys(dailyRevenue).map(date => ({
          date,
          revenue: dailyRevenue[date]
        }));

        setSalesData(formattedSalesData);
        setStats({
          revenue: totalRevenue,
          products: sellerProds.length,
          orders: sellerOrders.length,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchDashboardData();
  }, [user]);

  const statItems = [
    {
      title: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      trend: "+12.5%",
      color: "text-sky-500",
      bg: "bg-sky-500/10",
      path: "/dashboard",
    },
    {
      title: "Active Listings",
      value: stats.products,
      icon: PackageOpen,
      trend: "Live",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      path: "/dashboard/inventory",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: ShoppingBag,
      trend: "New",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      path: "/dashboard/orders",
    },
  ];

  return (
    <div className="animate-fade-in">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-2 uppercase tracking-tighter italic">
          Performance Hub
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 font-medium">
          Welcome back,{" "}
          <span className="text-sky-500 font-bold">{user?.firstName}</span>.
          Your shop is performing well.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statItems.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/5 rounded-4xl shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 group overflow-hidden"
          >
            <Link
              to={stat.path}
              className="block p-5 h-full w-full outline-none focus:bg-gray-50 dark:focus:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-all group-hover:scale-110`}
                >
                  <stat.icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest">
                    {stat.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tabular-nums tracking-tighter">
                      {stat.value}
                    </h3>
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${stat.color} ${stat.bg}`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">
                  View Details
                </span>
                <TrendingUp size={10} className={`${stat.color} rotate-90`} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 min-h-112.5 relative overflow-hidden group shadow-sm">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                Sales Velocity
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium uppercase tracking-widest">
                Growth Trends
              </p>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-gray-400">
                Live Sync
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center h-70 relative z-10 w-full">
            {loading ? (
              <p className="text-xs font-black text-sky-500 uppercase tracking-widest animate-pulse">
                Analyzing sales data...
              </p>
            ) : salesData.some(d => d.revenue > 0) ? (
              <div className="w-full h-48 flex items-end justify-between gap-1 px-4 mt-4">
                {salesData.map((data, i) => {
                  const maxRevenue = Math.max(...salesData.map(d => d.revenue));
                  const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group/bar">
                      <div className="relative w-full flex flex-col items-center justify-end h-32">
                        {/* Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-zinc-900 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white z-20 whitespace-nowrap shadow-xl">
                          ₹{data.revenue.toLocaleString()}
                        </div>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: i * 0.1, duration: 0.8 }}
                          className={`w-full max-w-[30px] rounded-t-lg bg-linear-to-t from-sky-600 to-sky-400 group-hover/bar:from-sky-400 group-hover/bar:to-sky-300 transition-colors shadow-2xl shadow-sky-500/20`}
                        />
                      </div>
                      <span className="text-[8px] text-gray-500 dark:text-zinc-500 font-bold mt-3 uppercase">
                        {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <>
                <BarChart3 className="w-12 h-12 text-gray-300 dark:text-zinc-800 mb-4" />
                <p className="text-sm font-black text-gray-400 dark:text-zinc-600 uppercase tracking-[0.2em] italic">
                  Growth metrics synchronized
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-linear-to-br from-zinc-900 to-black border border-white/5 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl flex flex-col items-center text-center">
          <div className="relative z-10 w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <ShoppingBag className="w-8 h-8 opacity-50" />
              <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${lowStockItems.length > 0 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {lowStockItems.length > 0 ? `${lowStockItems.length} Warnings` : 'Stock Healthy'}
              </div>
            </div>

            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-2 text-start">
              Grow Your Shop
            </h2>

            {lowStockItems.length > 0 ? (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar max-h-48 text-start">
                {lowStockItems.map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center justify-between group/item hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.productImg[0]?.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold truncate text-white uppercase">{item.productName}</p>
                        <p className="text-[8px] text-red-400 font-black">ONLY {item.quantity} LEFT</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/dashboard/inventory`)}
                      className="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <ArrowRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/50 font-medium leading-relaxed mt-4">
                Maintain high availability and competitive pricing to scale your operations.
              </p>
            )}

            {lowStockItems.length > 0 && (
              <button
                onClick={() => navigate('/dashboard/inventory')}
                className="mt-6 w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-sky-400 hover:text-white transition-all transform hover:scale-[1.02]"
              >
                Restock All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerAnalytics;
