import nodemailer from "nodemailer";
import { resolve4 } from "dns/promises";
import "dotenv/config";

export const otpmail = async (otp, email) => {
  // Pre-resolve to IPv4 — Render doesn't support IPv6 outbound
  // nodemailer's family:4 option is unreliable, so we resolve manually
  const [smtpIp] = await resolve4("smtp.gmail.com");

  const transporter = nodemailer.createTransport({
    host: smtpIp, // IPv4 address directly
    port: 587,
    secure: false,
    requireTLS: true,
    tls: {
      servername: "smtp.gmail.com", // needed for TLS cert validation when using IP
    },
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
