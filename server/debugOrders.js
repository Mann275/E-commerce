import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./Database/db.js";
import Order from "./models/orderModel.js";

const debugOrders = async () => {
    await connectDB();
    const orders = await Order.find().populate("userId").populate("items.productId");
    console.log(`Total orders in DB: ${orders.length}`);
    for (const order of orders) {
        console.log(`Order ID: ${order._id}`);
        console.log(`Total items: ${order.items.length}`);
        console.log(`Total amount: ${order.totalAmount}`);
        console.log("----");
    }
    process.exit();
};

debugOrders();
