import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://cloudinary.com/documentation/advanced_url_delivery_options",
    },
    profilePicPublicId: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "seller", "customer"],
      default: "customer",
    },
    token: {
      type: String,
      default: null,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    isloggedin: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    pincode: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;
