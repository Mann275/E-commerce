import "dotenv/config";
import { welcomeEmailTemplate } from "./EmailTemplet.js";

export const verifyEmail = async (firstName, token, email) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "OverClocked", email: process.env.MAIL_USER },
      to: [{ email }],
      subject: "Email Verification ✅",
      htmlContent: welcomeEmailTemplate(firstName, email, token, clientUrl),
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Error sending email:", error);
    throw new Error(error);
  }

  const data = await res.json();
  console.log("Email sent successfully:", data.messageId);
};
