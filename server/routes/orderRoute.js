import express from "express";
import { getSellerOrders, updateOrderStatus, createOrder, getMyOrders, cancelOrder, verifyPayment } from "../controllers/orderController.js";
import { isAuthenticated, isAdminOrSeller } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.put("/cancel/:orderId", isAuthenticated, cancelOrder);

router.get("/seller-orders", isAuthenticated, isAdminOrSeller, getSellerOrders);
router.put("/status/:orderId", isAuthenticated, isAdminOrSeller, updateOrderStatus);

export default router;
