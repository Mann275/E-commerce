import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Users, Search, ShieldAlert, ShieldCheck, Mail, Shield, User, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

function AdminUsers() {
    const { user: currentUser } = useSelector((store) => store.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const token = localStorage.getItem("accesstoken");
            const res = await axios.get(`${API_URL}/api/v1/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load platform users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle Role Change
    const handleRoleChange = async (userId, newRole) => {
        if (userId === currentUser?._id) {
            toast.error("You cannot change your own role!");
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const token = localStorage.getItem("accesstoken");

            // Optimistic Update
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));

            const res = await axios.put(`${API_URL}/api/v1/admin/users/role/${userId}`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success(`Role updated to ${newRole}`);
            }
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error(error.response?.data?.message || "Failed to update role");
            fetchUsers(); // Revert on failure
        }
    };

    // Handle Ban Toggle (Assuming you have a status field in schema)
    const handleBanToggle = async (userId, currentStatus) => {
        if (userId === currentUser?._id) {
            toast.error("You cannot ban yourself!");
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const token = localStorage.getItem("accesstoken");

            const isCurrentlyBanned = currentStatus === "banned";
            const newStatus = isCurrentlyBanned ? "active" : "banned";

            // Optimistic Update
            setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));

            const res = await axios.put(`${API_URL}/api/v1/admin/users/ban/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error updating ban status:", error);
            toast.error(error.response?.data?.message || "Failed to update ban status");
            fetchUsers(); // Revert on failure
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="pt-8 relative overflow-hidden min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 relative z-10"
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500 italic">Users</span>
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium tracking-tight">Manage customers and seller accounts.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Role Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full sm:w-auto pl-4 pr-10 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-all text-sm font-medium dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="all">All Roles</option>
                            <option value="customer">Customers</option>
                            <option value="seller">Sellers</option>
                            <option value="admin">Admins</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-all text-sm font-medium dark:text-white"
                        />
                    </div>
                </div>
            </motion.div>

            <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm overflow-hidden relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-zinc-400 font-medium">Fetching global registry...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/10">
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</th>
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Role Authority</th>
                                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <motion.tr
                                                key={user._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className={`border-b border-gray-100 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors group ${user.status === 'banned' ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        {user.profilePic ? (
                                                            <img src={user.profilePic} alt="avatar" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                                                                {user.firstName?.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white capitalize group-hover:text-indigo-500 transition-colors">
                                                                {user.firstName} {user.lastName}
                                                                {user._id === currentUser?._id && <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-500 px-2 py-0.5 rounded-full uppercase tracking-widest leading-none align-middle">You</span>}
                                                            </p>
                                                            <p className="text-xs text-gray-500 font-mono">ID: {user._id.slice(-6)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                        <Mail size={14} className="text-gray-400" />
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                        disabled={user.role === "admin" && user._id === currentUser?._id}
                                                        className={`text-xs font-black tracking-widest uppercase rounded-lg px-3 py-1.5 border-0 focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer outline-none transition-all shadow-sm ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20' :
                                                            user.role === 'seller' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' :
                                                                'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
                                                            }`}
                                                    >
                                                        <option value="customer" className="text-gray-900 bg-white">Customer</option>
                                                        <option value="seller" className="text-gray-900 bg-white">Seller</option>
                                                        {currentUser?.role === "admin" && <option value="admin" className="text-gray-900 bg-white">Admin</option>}
                                                    </select>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    {user._id !== currentUser?._id && user.role !== "admin" ? (
                                                        <button
                                                            onClick={() => handleBanToggle(user._id, user.status)}
                                                            className={`p-2 rounded-xl transition-all shadow-sm flex items-center justify-center ml-auto ${user.status === 'banned'
                                                                ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20"
                                                                : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30"
                                                                }`}
                                                            title={user.status === 'banned' ? "Unban Account" : "Ban Account"}
                                                        >
                                                            {user.status === 'banned' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                                                        </button>
                                                    ) : (
                                                        <div className="p-2 rounded-xl inline-flex text-gray-300 dark:text-gray-600 cursor-not-allowed">
                                                            <Shield size={18} />
                                                        </div>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-gray-500 dark:text-zinc-400 font-medium">
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsers;
