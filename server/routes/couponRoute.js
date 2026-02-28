import express from "express";
import { createCoupon, getSellerCoupons, deleteCoupon } from "../controllers/couponController.js";
import { isAuthenticated, isAdminOrSeller } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, isAdminOrSeller, createCoupon);
router.get("/seller-coupons", isAuthenticated, isAdminOrSeller, getSellerCoupons);
router.delete("/delete/:id", isAuthenticated, isAdminOrSeller, deleteCoupon);

export default router;
