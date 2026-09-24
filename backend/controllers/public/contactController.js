import asyncHandler from "express-async-handler";
import { sendEmailSafe } from "../../utils/sendEmail.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#039;");

export const submitContactMessage = asyncHandler(async (req, res) => {
  const name = String(req.body.name ?? "").trim();
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const message = String(req.body.message ?? "").trim();

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email, and message are required");
  }
  if (name.length < 2 || name.length > 100) {
    res.status(400);
    throw new Error("Name must be between 2 and 100 characters");
  }
  if (!emailRegex.test(email) || email.length > 150) {
    res.status(400);
    throw new Error("Please enter a valid email address");
  }
  if (message.length < 10 || message.length > 2000) {
    res.status(400);
    throw new Error("Message must be between 10 and 2000 characters");
  }

  const recipient = process.env.EMAIL_SUPPORT_TO || process.env.EMAIL_USER;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const emailSent = await sendEmailSafe({
    to: recipient,
    subject: `New LocalBites contact message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<h3>New LocalBites contact message</h3><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong></p><p>${safeMessage}</p>`,
  });

  if (!emailSent) {
    res.status(503);
    throw new Error("We could not send your message right now. Please try again later.");
  }

  res.status(200).json({ message: "Your message has been sent successfully" });
});