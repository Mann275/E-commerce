import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import {
  isAuthenticated,
  isAuthenticatedAllowBanned,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticatedAllowBanned, getWishlist);
router.post("/add", isAuthenticated, addToWishlist);
router.post("/remove", isAuthenticated, removeFromWishlist);

export default router;
