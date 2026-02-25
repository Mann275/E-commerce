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
  updateProfile,
  changePassword,
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
router.get("/get-user/:id", getUserById);
router.put("/update-profile", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);

export default router;
