import express from "express";
import "dotenv/config";
import connectDB from "./Database/db.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true,
  }),
);

// localhost:8000/api/v1/users/
app.use("/api/v1/users", userRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`🚩Server is running on port : ${PORT}`);
});
