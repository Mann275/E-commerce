import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import connectDB from "./Database/db.js";
import User from "./models/userModel.js";

const demoUsers = [
    {
        firstName: "Customer",
        lastName: "Demo",
        email: "customer@example.com",
        password: "Mann123",
        role: "customer",
        isverified: true
    },
    {
        firstName: "Admin",
        lastName: "Demo",
        email: "admin@example.com",
        password: "Mann123",
        role: "admin",
        isverified: true
    },
    {
        firstName: "Seller",
        lastName: "Demo",
        email: "seller@example.com",
        password: "Mann123",
        role: "seller",
        isverified: true
    },
    {
        firstName: "S1",
        lastName: "Demo",
        email: "s1@example.com",
        password: "Mann123",
        role: "seller",
        isverified: true
    },
    {
        firstName: "C1",
        lastName: "Demo",
        email: "c1@example.com",
        password: "Mann123",
        role: "customer",
        isverified: true
    },
    {
        firstName: "S2",
        lastName: "Demo",
        email: "s2@example.com",
        password: "Mann123",
        role: "seller",
        isverified: true
    },
    {
        firstName: "C2",
        lastName: "Demo",
        email: "c2@example.com",
        password: "Mann123",
        role: "customer",
        isverified: true
    }
];

const seedUsers = async () => {
    try {
        await connectDB();

        // Delete existing demo users if any to avoid duplicates
        await User.deleteMany({ email: { $in: demoUsers.map(u => u.email) } });

        const hashedUsers = await Promise.all(demoUsers.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        }));

        const createdUsers = await User.insertMany(hashedUsers);
        console.log("Demo users seeded successfully!");

        const seller = createdUsers.find(u => u.role === "seller");
        console.log("SELLER_ID_START[" + seller._id + "]SELLER_ID_END");

        process.exit();
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();
