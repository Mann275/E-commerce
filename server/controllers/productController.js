import Product from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const addProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand, discountPercentage, quantity } = req.body;
        const userId = req.id;

        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Handle multiple image uploads
        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "Overclocked/Products" // cloudinary folder name
                });

                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        const newProduct = await Product.create({
            productName,
            productDesc,
            productPrice: Number(productPrice),
            discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
            quantity: quantity ? Number(quantity) : 0,
            category,
            brand,
            productImg,
            userId
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("userId", "firstName lastName email").populate("reviews.userId", "firstName lastName profilePic").sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (req.user.role !== "admin" && product.userId.toString() !== req.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only delete your own products.",
            });
        }

        // Delete images from cloudinary
        if (product.productImg && product.productImg.length > 0) {
            for (let img of product.productImg) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
        }

        // Delete product from MongoDB
        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productDesc, productPrice, category, brand, discountPercentage, quantity, existingImages } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (req.user.role !== "admin" && product.userId.toString() !== req.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only update your own products.",
            });
        }

        let updatedImages = [];

        if (existingImages) {
            const keepIds = Array.isArray(existingImages) ? existingImages : [existingImages];
            const removedImages = product.productImg.filter(
                (img) => !keepIds.includes(img.public_id)
            );
            for (let img of removedImages) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
            updatedImages = product.productImg.filter((img) => keepIds.includes(img.public_id));
        } else {
            updatedImages = product.productImg; //keep all if nothing sent
        }

        // upload new images if any
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "Overclocked/Products"
                });
                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        // update product
        product.productName = productName || product.productName;
        product.productDesc = productDesc || product.productDesc;
        product.productPrice = productPrice || product.productPrice;
        if (discountPercentage !== undefined) {
            product.discountPercentage = discountPercentage;
        }
        if (quantity !== undefined) {
            product.quantity = quantity;
        }
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.productImg = updatedImages;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId)
            .populate("userId", "firstName lastName email")
            .populate("reviews.userId", "firstName lastName profilePic");

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const addReviewToProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.id;

        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: "Rating and comment are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check if user already reviewed
        const existingReviewIndex = product.reviews.findIndex(r => r.userId.toString() === userId.toString());

        if (existingReviewIndex !== -1) {
            // Update existing review
            product.reviews[existingReviewIndex].rating = Number(rating);
            product.reviews[existingReviewIndex].comment = comment;
        } else {
            // Add new review
            product.reviews.push({
                userId,
                rating: Number(rating),
                comment
            });
        }

        await product.save();

        // Return populated product
        const updatedProduct = await Product.findById(productId)
            .populate("reviews.userId", "firstName lastName profilePic");

        return res.status(200).json({
            success: true,
            message: "Review added successfully",
            product: updatedProduct
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

