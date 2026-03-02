import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../controllers/cartController.js";
import {
  isAuthenticated,
  isAuthenticatedAllowBanned,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticatedAllowBanned, getCart);
router.post("/add", isAuthenticated, addToCart);
router.post("/remove", isAuthenticated, removeFromCart);
router.put("/update", isAuthenticated, updateCartItemQuantity);
router.delete("/clear", isAuthenticated, clearCart);

export default router;
