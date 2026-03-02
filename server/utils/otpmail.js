import "dotenv/config";

export const otpmail = async (otp, email) => {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "OverClocked", email: process.env.MAIL_USER },
      to: [{ email }],
      subject: "Password Reset OTP Verification",
      htmlContent: `<p>Dear User,</p>
      <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your password:</p>
      <h2><b>${otp}</b></h2>
      <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
      <p>Best regards,<br>Mann Patel</p>`,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Error sending OTP email:", error);
    throw new Error(error);
  }

  const data = await res.json();
  console.log("OTP sent successfully:", data.messageId);
};
