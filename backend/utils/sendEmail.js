// backend/utils/sendEmail.js

import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mail = {
    from: `"LocalBites" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  if (html) mail.html = html;
  await transporter.sendMail(mail);
};

export const sendEmailSafe = async (options) => {
  try {
    await sendEmail(options);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return false;
  }
};

export default sendEmail;