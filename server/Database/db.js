import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/Techstore`);
    console.log("✅Connected to MongoDB successfully");
  } catch (error) {
    console.log("❌Error connecting to MongoDB:", error);
    console.log("❌Error connecting to MongoDB:", error);
  }
};

export default connectDB;
