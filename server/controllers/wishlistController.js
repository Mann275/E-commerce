import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

// Fetch user wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.id;
        let wishlist = await Wishlist.findOne({ userId }).populate("items.productId");

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId, items: [] });
        }

        return res.status(200).json({ success: true, wishlist });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Add item to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId, items: [{ productId }] });
        } else {
            const itemExists = wishlist.items.some(p => p.productId.toString() === productId);
            if (!itemExists) {
                wishlist.items.push({ productId });
                await wishlist.save();
            }
        }

        wishlist = await Wishlist.findById(wishlist._id).populate("items.productId");
        return res.status(200).json({ success: true, message: "Added to wishlist", wishlist });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (wishlist) {
            wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
            await wishlist.save();
            wishlist = await Wishlist.findById(wishlist._id).populate("items.productId");
            return res.status(200).json({ success: true, message: "Removed from wishlist", wishlist });
        }
        return res.status(404).json({ success: false, message: "Wishlist not found" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
