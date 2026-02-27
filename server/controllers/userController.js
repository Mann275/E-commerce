import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../utils/verifyEmail.js";
import Session from "../models/sessionModel.js";
import { otpmail } from "../utils/otpmail.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Password validation (require 3 out of 5 conditions)
    let validConditions = 0;
    if (password.length >= 8) validConditions++;
    if (/[A-Z]/.test(password)) validConditions++;
    if (/[a-z]/.test(password)) validConditions++;
    if (/\d/.test(password)) validConditions++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) validConditions++;

    if (validConditions < 3) {
      return res.status(400).json({
        success: false,
        message: "Password is too weak. It must satisfy at least 3 of these conditions: 8+ characters, uppercase, lowercase, number, special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 11);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "customer",
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    verifyEmail(firstName, token, email); // email will send from here
    newUser.token = token;
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authoriation token is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "Token has expired",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
      }
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    user.token = null;
    user.isverified = true;
    user.isloggedin = true;
    await user.save();

    // Generate access and refresh tokens for auto-login
    const accesstoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    const refreshtoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    // Create session for the user
    await Session.create({ userId: user._id });

    return res.status(200).json({
      success: true,
      message: `Welcome, ${user.firstName}! Your email has been verified successfully.`,
      user: user,
      accesstoken,
      refreshtoken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reverify = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    verifyEmail(user.firstName, token, email); // email will send from here for reverify
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Verification email sent again successfully",
      token: user.token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    if (user.isverified === false) {
      return res.status(400).json({
        success: false,
        message: "Email is not verified. Please verify your email.",
      });
    }

    // Generate a new token for the user
    const accesstoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    const refreshtoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    user.isloggedin = true;
    await user.save();

    // Creating a new session for the user
    await Session.create({ userId: user._id });
    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.firstName}! You have logged in successfully.`,
      user: user,
      accesstoken,
      refreshtoken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.id;
    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isloggedin: false });
    return res.status(200).json({
      success: true,
      message: "You have logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    // Generate a password reset otp and send it to the user's email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send the OTP to the user's email
    await otpmail(otp, email); // email will send from here for password reset
    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;
    if (!otp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired.",
      });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are required",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Check if new password is same as old password
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as your old password",
      });
    }

    // Password validation (require 3 out of 5 conditions)
    let validConditions = 0;
    if (newPassword.length >= 8) validConditions++;
    if (/[A-Z]/.test(newPassword)) validConditions++;
    if (/[a-z]/.test(newPassword)) validConditions++;
    if (/\d/.test(newPassword)) validConditions++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) validConditions++;

    if (validConditions < 3) {
      return res.status(400).json({
        success: false,
        message: "Password is too weak. It must satisfy at least 3 of these conditions: 8+ characters, uppercase, lowercase, number, special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 11);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token",
    ); // Exclude from the response
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect old password" });

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New passwords do not match" });
    }

    // Checking if new password is same as old
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    // Password validation (require 3 out of 5 conditions)
    let validConditions = 0;
    if (newPassword.length >= 8) validConditions++;
    if (/[A-Z]/.test(newPassword)) validConditions++;
    if (/[a-z]/.test(newPassword)) validConditions++;
    if (/\d/.test(newPassword)) validConditions++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) validConditions++;

    if (validConditions < 3) {
      return res.status(400).json({
        success: false,
        message: "Password is too weak. It must satisfy at least 3 of these conditions: 8+ characters, uppercase, lowercase, number, special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 11);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUserId = req.id;
    const { firstName, lastName, phoneNo, address, city, pincode, role, showPhone, showEmail } =
      req.body;

    const loggedInUser = await User.findById(loggedInUserId);
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this user",
      });
    }
    let user = await User.findById(userIdToUpdate);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "Overclocked/ProfilePic" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(req.file.buffer);
      });
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    } else if (req.body.profilePic === "") {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }
      profilePicUrl = "";
      profilePicPublicId = "";
    }
    // Updating fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNo = phoneNo !== undefined ? phoneNo : user.phoneNo;

    // Privacy toggles (can be literal false so we use explicit checking)
    if (showPhone !== undefined) user.showPhone = showPhone === 'true' || showPhone === true;
    if (showEmail !== undefined) user.showEmail = showEmail === 'true' || showEmail === true;

    user.address = address !== undefined ? address : user.address;
    user.city = city !== undefined ? city : user.city;
    user.pincode = pincode !== undefined ? pincode : user.pincode;
    user.role = role || user.role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addUserAddress = async (req, res) => {
  try {
    const userId = req.id;
    const { address, city, pincode } = req.body;

    if (!address || !city || !pincode) {
      return res.status(400).json({ success: false, message: "All address fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.addresses.push({ address, city, pincode });
    await user.save();

    return res.status(200).json({ success: true, message: "Address added successfully", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const editUserAddress = async (req, res) => {
  try {
    const userId = req.id;
    const { addressId } = req.params;
    const { address, city, pincode } = req.body;

    if (!address || !city || !pincode) {
      return res.status(400).json({ success: false, message: "All address fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const addrIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addrIndex === -1) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    user.addresses[addrIndex] = { ...user.addresses[addrIndex], address, city, pincode };
    await user.save();

    return res.status(200).json({ success: true, message: "Address updated successfully", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeUserAddress = async (req, res) => {
  try {
    const userId = req.id;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    return res.status(200).json({ success: true, message: "Address removed successfully", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
