import express from "express";
import "dotenv/config";
import connectDB from "./Database/db.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://over-clocked.vercel.app/",
      /^https:\/\/.*\.vercel\.app$/, // Allows all Vercel preview domains
    ],
    credentials: true,
  }),
);

// localhost:8000/api/v1/users/
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`🚩Server is running on port : ${PORT}`);
});
