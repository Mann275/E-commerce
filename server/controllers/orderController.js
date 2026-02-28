import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import razorpayInstance from "../config/razorpay.js";
import crypto from "crypto";

// Create new orders from cart
export const createOrder = async (req, res) => {
    // Create Order Request logging removed for cleaner terminal
    try {
        const userId = req.user._id;
        const { shippingAddress, paymentMethod, items, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // Split items by seller, robustly finding the seller if missing
        const ordersBySeller = {};
        for (const item of items) {
            let sId = item.sellerId?._id || item.sellerId;
            const prodId = item.productId?._id || item.productId || item._id;

            if (!sId && prodId) {
                // Fallback: Query the database for the product's owner if frontend missed it
                const productOwner = await Product.findById(prodId).select("userId");
                if (productOwner) {
                    sId = productOwner.userId.toString();
                }
            }

            if (sId) {
                if (!ordersBySeller[sId]) ordersBySeller[sId] = [];
                ordersBySeller[sId].push(item);
            } else {
                console.error(`CRITICAL: Could not determine seller for item:`, item);
            }
        }

        const createdOrders = [];

        // VALIDATION: Check if all items are still active and in stock
        for (const item of items) {
            const prodId = item.productId?._id || item.productId || item._id;
            if (!prodId) {
                console.error("CRITICAL: Item missing productId:", item);
                continue;
            }
            const product = await Product.findById(prodId);
            if (!product) {
                return res.status(400).json({ success: false, message: `Product ${item.productName || prodId} no longer exists. Please remove it from your cart.` });
            }
            if (product.status === "inactive") {
                return res.status(400).json({ success: false, message: `Item "${product.productName}" is no longer available for purchase.` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for "${product.productName}". Available: ${product.quantity}` });
            }
        }

        for (const sId in ordersBySeller) {
            const sellerItems = ordersBySeller[sId];

            const processedItems = sellerItems.map(item => {
                const itemPrice = item.price || item.productPrice || item.finalPrice || 0;
                return {
                    productId: item.productId?._id || item.productId || item._id,
                    quantity: item.quantity,
                    price: itemPrice,
                    sellerId: sId
                };
            });

            const sellerTotal = processedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const newOrder = new Order({
                userId,
                items: processedItems,
                totalAmount: sellerTotal,
                paymentMethod,
                shippingAddress,
                orderStatus: "Pending" // All orders start as Pending (Awaiting Confirmation by seller or payment gateway)
            });

            await newOrder.save();
            createdOrders.push(newOrder);

            // Update product stock (simple version)
            for (const item of sellerItems) {
                await Product.findByIdAndUpdate(item.productId?._id || item.productId || item._id, {
                    $inc: { quantity: -item.quantity }
                });
            }
        }

        // If Online Payment, generate Razorpay Order
        if (paymentMethod === "Online") {
            const options = {
                amount: Math.round(totalAmount * 100), // convert to paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            };

            const razorpayOrder = await razorpayInstance.orders.create(options);

            // Update all created orders with the razorpay Order ID
            for (const order of createdOrders) {
                order.razorpayOrderId = razorpayOrder.id;
                await order.save();
            }

            return res.status(201).json({
                success: true,
                message: "Razorpay order created",
                razorpayOrder,
                orderIds: createdOrders.map(o => o._id)
            });
        }

        // Clear Cart for COD
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({
            success: true,
            message: "Order placed successfully (COD)",
            orderIds: createdOrders.map(o => o._id)
        });

    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get all orders for a specific seller
export const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;

        // Find orders that contain items belonging to this seller
        const orders = await Order.find({ "items.sellerId": sellerId })
            .populate("userId", "firstName lastName email")
            .populate("items.productId", "productName productImg")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Update order status with restrictions
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const sellerId = req.user._id;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        // Verify ownership (simplified: any item in order belonging to seller)
        const isOwner = order.items.some(item => item.sellerId.toString() === sellerId.toString());
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // Restore stock if cancelled by seller
        if (status === "Cancelled" && order.orderStatus !== "Cancelled") {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { quantity: item.quantity }
                });
            }
        }

        order.orderStatus = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get orders for customer
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ userId })
            .populate({
                path: "items.productId",
                select: "productName productImg userId",
                populate: {
                    path: "userId",
                    select: "firstName lastName"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Cancel order (Customer)
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        // Can only cancel if Pending or Placed
        if (!["Pending", "Placed"].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled at this stage"
            });
        }

        order.orderStatus = "Cancelled";
        await order.save();

        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { quantity: item.quantity }
            });
        }

        res.status(200).json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user._id;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Update all orders linked to this razorpay_order_id
            const orders = await Order.find({ razorpayOrderId: razorpay_order_id });

            for (const order of orders) {
                order.orderStatus = "Placed"; // Or "Success" as per screenshot
                order.transactionId = razorpay_payment_id;
                await order.save();
            }

            // Clear Cart after successful payment
            await Cart.findOneAndDelete({ userId });

            return res.status(200).json({
                success: true,
                message: "Payment verified and order placed successfully",
                orders: orders
            });
        } else {
            // Mark orders as Failed
            await Order.updateMany(
                { razorpayOrderId: razorpay_order_id },
                { orderStatus: "Failed" }
            );

            return res.status(400).json({
                success: false,
                message: "Invalid signature, payment verification failed"
            });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
