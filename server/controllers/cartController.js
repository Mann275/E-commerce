import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Fetch user cart
export const getCart = async (req, res) => {
    try {
        const userId = req.id;
        let cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ success: false, message: "Product not found" });
        }
        if (product.quantity <= 0) {
            return res.status(400).json({ success: false, message: "Product is out of stock" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({ userId, items: [{ productId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

            if (itemIndex > -1) {
                // Item exists, update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Item does not exist, add new item
                cart.items.push({ productId, quantity });
            }
            await cart.save();
        }

        cart = await Cart.findById(cart._id).populate("items.productId");
        return res.status(200).json({ success: true, message: "Added to cart", cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            await cart.save();
            cart = await Cart.findById(cart._id).populate("items.productId");
            return res.status(200).json({ success: true, message: "Removed from cart", cart });
        }
        return res.status(404).json({ success: false, message: "Cart not found" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update item quantity
export const updateCartItemQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ success: false, message: "Product ID and quantity are required" });
        }

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;
                await cart.save();
                cart = await Cart.findById(cart._id).populate("items.productId");
                return res.status(200).json({ success: true, message: "Quantity updated", cart });
            }
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }
        return res.status(404).json({ success: false, message: "Cart not found" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.id;
        let cart = await Cart.findOne({ userId });

        if (cart) {
            cart.items = [];
            await cart.save();
            return res.status(200).json({ success: true, message: "Cart cleared", cart });
        }
        // If the cart doesn't exist, it's effectively "cleared" already. Return 200 to avoid frontend crash panics.
        return res.status(200).json({ success: true, message: "Cart already empty/nonexistent" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
