import nodemailer from "nodemailer";
import "dotenv/config";

export const otpmail = async (otp, email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // 465 is blocked by Render, use 587 (STARTTLS)
    secure: false, // false = STARTTLS (upgrades after connection)
    requireTLS: true,
    family: 4, // Force IPv4 — Render doesn't support IPv6
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailConfiguration = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password Reset OTP Verification",
    html: `<p>Dear User,</p>
    <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your password:</p>
    <h2><b>${otp}</b></h2>
    <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,<br>Mann Patel</p>`,
  };

  try {
    const info = await transporter.sendMail(mailConfiguration);
    console.log("OTP sent successfully:", info.messageId);
  } catch (err) {
    console.log("Error sending OTP email:", err);
    throw err;
  }
};
