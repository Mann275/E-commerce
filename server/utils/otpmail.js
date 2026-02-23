import nodemailer from "nodemailer";
import "dotenv/config";

export const otpmail = async (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
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

  transporter.sendMail(mailConfiguration, function (err, data) {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("OTP sent successfully");
    }
  });
};
