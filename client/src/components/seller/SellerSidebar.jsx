import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    PlusSquare,
    ShoppingCart,
    Tag,
    Settings,
    ChevronRight
} from "lucide-react";

const navItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard", end: true },
    { label: "Inventory", icon: Package, path: "/dashboard/inventory" },
    { label: "Add Product", icon: PlusSquare, path: "/dashboard/add-product" },
    { label: "Orders", icon: ShoppingCart, path: "/dashboard/orders" },
];

function SellerSidebar() {
    return (
        <aside className="fixed bottom-0 left-0 w-full md:w-16 lg:w-20 md:left-4 md:top-24 md:bottom-6 z-[60] flex md:flex-col">
            <div className="w-full md:flex-1 bg-white dark:bg-zinc-950 border-t md:border border-gray-200 dark:border-white/10 md:rounded-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-2xl flex flex-row md:flex-col py-3 md:py-8 px-4 md:px-0 items-center justify-around md:justify-start gap-2 md:gap-6">
                <nav className="flex flex-row md:flex-col gap-2 md:gap-4 w-full md:px-2 justify-around md:justify-start">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            title={item.label}
                            className={({ isActive }) => `
                                relative flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 mx-auto rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={22} className="relative z-10" />

                                    {/* Hover Label Tooltip */}
                                    <span className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/10">
                                        {item.label}
                                    </span>

                                    {isActive && (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 md:bottom-auto md:left-1 w-6 h-1 md:w-1 md:h-6 bg-sky-500 md:bg-white rounded-t-lg md:rounded-t-none md:rounded-r-lg shadow-sm" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden md:block mt-auto px-2 w-full">
                    <NavLink
                        to="/dashboard/settings"
                        title="Settings"
                        className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 mx-auto rounded-2xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all group relative"
                    >
                        <Settings size={22} />
                        <span className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            Settings
                        </span>
                    </NavLink>
                </div>
            </div>
        </aside>
    );
}

export default SellerSidebar;
