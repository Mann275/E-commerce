import nodemailer from "nodemailer";
import "dotenv/config";
import { welcomeEmailTemplate } from "./EmailTemplet.js";
export const verifyEmail = async (firstName, token, email) => {
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

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const mailConfiguration = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification ✅",
    html: welcomeEmailTemplate(firstName, email, token, clientUrl),
  };

  try {
    const info = await transporter.sendMail(mailConfiguration);
    console.log("Email sent successfully:", info.messageId);
  } catch (err) {
    console.log("Error sending email:", err);
    throw err;
  }
};
