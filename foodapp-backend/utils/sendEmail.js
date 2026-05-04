// utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // ✅ Development mein console pe bhi print karo
    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email would be sent to:", to);
      console.log("Subject:", subject);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password (not regular password)
      },
    });

    const mailOptions = {
      from: `"LocalBites 🍔" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "Please view this email in HTML format",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;