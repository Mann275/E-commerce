import nodemailer from "nodemailer";
import "dotenv/config";
import { welcomeEmailTemplate } from "./EmailTemplet.js";
export const verifyEmail = (firstName, token, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
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

  transporter.sendMail(mailConfiguration, function (err, data) {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent successfully");
    }
  });
};
