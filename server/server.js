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
app.use(express.json());


app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://over-clocked.vercel.app/",
      /^https:\/\/.*\.vercel\.app$/, // Allows all Vercel preview domains
    ],
    credentials: true,
  }),
);

// localhost:8000/api/v1/users/
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
