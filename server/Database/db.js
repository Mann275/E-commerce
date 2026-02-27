import mongoose from "mongoose";
import chalk from "chalk";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/Techstore`);

    console.log(`${chalk.blue("Connected to MongoDB successfully!")}`);
  } catch (error) {
    console.log(`${chalk.red("Error connecting to MongoDB:")}`, error);
  }
};

export default connectDB;
