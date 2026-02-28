import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

// @desc    Get dashboard analytics (Total Users, Sellers, Products, Orders, Revenue)
export const getAdminAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSellers = await User.countDocuments({ role: "seller" });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Calculate total gross revenue from delivered orders
        const orders = await Order.find({ orderStatus: "Delivered" });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        return res.status(200).json({
            success: true,
            analytics: {
                totalUsers,
                totalSellers,
                totalProducts,
                totalOrders,
                totalRevenue
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all users (for Admin Users table)
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users except passwords
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a user's role (Promote to seller/admin or demote)
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["customer", "seller", "admin"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role specified" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Prevent self-demotion to avoid locking out the only admin
        if (user._id.toString() === req.id.toString()) {
            return res.status(400).json({ success: false, message: "You cannot change your own role" });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            user: { _id: user._id, firstName: user.firstName, role: user.role }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Ban or Unban a user
export const toggleUserBanStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user._id.toString() === req.id.toString()) {
            return res.status(400).json({ success: false, message: "You cannot ban yourself" });
        }

        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "You cannot ban other admins" });
        }

        // Toggle status between active and banned
        const newStatus = user.status === "banned" ? "active" : "banned";
        user.status = newStatus;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `User ${newStatus === 'banned' ? 'banned' : 'unbanned'} successfully`,
            status: newStatus
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders globally
export const getAllGlobalOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("userId", "firstName lastName email")
            .populate("items.productId", "productName productImg productPrice")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
