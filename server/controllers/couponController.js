import Coupon from "../models/couponModel.js";

// Create a new coupon
export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit } = req.body;
        const sellerId = req.user._id;

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists",
            });
        }

        const coupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            minOrderAmount,
            expiresAt,
            usageLimit,
            sellerId,
        });

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon,
        });
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get coupons for a specific seller
export const getSellerCoupons = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const coupons = await Coupon.find({ sellerId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            coupons,
        });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Delete a coupon
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = req.user._id;

        const coupon = await Coupon.findOneAndDelete({ _id: id, sellerId });
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found or unauthorized",
            });
        }

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
