import express from "express";
import "dotenv/config";
import connectDB from "./Database/db.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import orderRoute from "./routes/orderRoute.js";
import couponRoute from "./routes/couponRoute.js";
import adminRoute from "./routes/adminRoute.js";
import cors from "cors";
import chalk from "chalk";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Parse JSON bodies (only once!)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log request bodies in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(
        `📦 Request Body for ${req.method} ${req.url}:`,
        JSON.stringify(req.body).substring(0, 200),
      );
    }
    next();
  });
}

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://over-clocked.vercel.app",
      /^https:\/\/.*\.vercel\.app$/, // Allows all Vercel preview domains
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    env: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMongoUri: !!process.env.MONGO_URI,
      nodeEnv: process.env.NODE_ENV || "development",
    },
  });
});

// API Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/coupons", couponRoute);
app.use("/api/v1/admin", adminRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(chalk.magenta(`🚩Server is running on port : ${PORT}`));
});
