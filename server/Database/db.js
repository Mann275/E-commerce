import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/Techstore`);
    console.log(`
╔═══════════════════════════════════════════╗
║        ✅ OverClocked SERVER              ║
╠═══════════════════════════════════════════╣
║       Status:  Running                    ║
║       Port:    ${process.env.PORT || 8000}                       ║
║       Mode:    Development                ║
╚═══════════════════════════════════════════╝
    `);
  } catch (error) {
    console.log("❌Error connecting to MongoDB:", error);
    console.log("❌Error connecting to MongoDB:", error);
  }
};

export default connectDB;
