import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getWishlist);
router.post("/add", isAuthenticated, addToWishlist);
router.post("/remove", isAuthenticated, removeFromWishlist);

export default router;
