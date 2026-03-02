import nodemailer from "nodemailer";
import { resolve4 } from "dns/promises";
import "dotenv/config";
import { welcomeEmailTemplate } from "./EmailTemplet.js";
export const verifyEmail = async (firstName, token, email) => {
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
