import express from "express";
import {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProductById,
  addReviewToProduct,
  toggleProductStatus
} from "../controllers/productController.js";
import { isAuthenticated, isAdmin, isAdminOrSeller } from "../middleware/isAuthenticated.js";
import { uploadMultiple } from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/add-product",
  isAuthenticated,
  isAdminOrSeller,
  uploadMultiple,
  addProduct,
);

router.delete('/delete/:productId', isAuthenticated, isAdminOrSeller, deleteProduct)
router.put("/update/:productId", isAuthenticated, isAdminOrSeller, uploadMultiple, updateProduct)

router.get("/getallproducts", getAllProducts);
router.get("/get/:productId", getProductById);
router.post("/:productId/review", isAuthenticated, addReviewToProduct);
router.put("/toggle-status/:productId", isAuthenticated, isAdminOrSeller, toggleProductStatus);

export default router;
