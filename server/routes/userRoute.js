import express from "express";
import {
  login,
  register,
  reverify,
  verify,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
  allUsers,
  getUserById,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reverify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/forgotpassword", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/reset-password/:email", resetPassword);
router.get("/all-users", isAuthenticated, isAdmin, allUsers);
router.get("/get-user/:id", getUserById);

export default router;
