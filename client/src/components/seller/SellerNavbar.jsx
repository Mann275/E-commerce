import React from "react";
import { Search, Bell, User } from "lucide-react";
import { useSelector } from "react-redux";

const SellerNavbar = () => {
    const { user } = useSelector((state) => state.user);

    return (
        <nav className="h-16 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-30 transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search products, orders..."
                        className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-sky-500/30 rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:outline-none transition-all dark:text-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-500 hover:text-sky-500 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-950" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100 dark:border-white/5">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                            Verified Seller
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20">
                        <div className="w-full h-full rounded-full border-2 border-white dark:border-zinc-950 bg-white dark:bg-zinc-900 overflow-hidden">
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-sky-500 font-black text-xs">
                                    {user?.firstName?.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default SellerNavbar;
