import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  getAdminAnalytics,
  getAllUsers,
  updateUserRole,
  toggleUserBanStatus,
  deleteUser,
  getAllGlobalOrders,
} from "../controllers/adminController.js";

const router = express.Router();

// All routes here should be protected by isAuthenticated AND isAdmin
router.use(isAuthenticated, isAdmin);

// Analytics
router.get("/analytics", getAdminAnalytics);

// User Management
router.get("/users", getAllUsers);
router.put("/users/role/:id", updateUserRole);
router.put("/users/ban/:id", toggleUserBanStatus);
router.delete("/users/:id", deleteUser);

// Order Management
router.get("/orders", getAllGlobalOrders);

export default router;
