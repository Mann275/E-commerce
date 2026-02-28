import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                sellerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "Online", "UPI"],
            required: true,
        },
        transactionId: String,
        razorpayOrderId: String,
        orderStatus: {
            type: String,
            enum: ["Pending", "Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Failed"],
            default: "Pending",
        },
        shippingAddress: {
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            address: String,
            city: String,
            zipCode: String,
            country: String,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
