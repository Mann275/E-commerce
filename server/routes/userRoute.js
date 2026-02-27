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
  changePassword,
  updateUser,
  addUserAddress,
  editUserAddress,
  removeUserAddress,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { uploadSingle } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reverify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/forgotpassword", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/reset-password/:email", resetPassword);
router.post("/allusers", allUsers);
router.get("/get-user/:id", getUserById);
router.put("/change-password", isAuthenticated, changePassword);
router.put("/update/:id", isAuthenticated, uploadSingle, updateUser);

// Address Management Routes
router.post("/address", isAuthenticated, addUserAddress);
router.put("/address/:addressId", isAuthenticated, editUserAddress);
router.delete("/address/:addressId", isAuthenticated, removeUserAddress);

export default router;
