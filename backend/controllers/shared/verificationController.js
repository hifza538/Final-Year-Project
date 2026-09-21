// backend/controllers/shared/verificationController.js

import crypto from "crypto";
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import sendEmail from "../../utils/sendEmail.js";

const FRONTEND_URLS = {
  customer: process.env.CUSTOMER_FRONTEND_URL,
  vendor: process.env.VENDOR_FRONTEND_URL,
  delivery: process.env.DELIVERY_FRONTEND_URL,
};

// verification email is sent when a user registers, and the link expires after 24 hours. The user can also request a new verification email if the first one was missed or expired.
export const sendVerificationEmail = async (user) => {
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(verifyToken).digest("hex");

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save();

  const baseUrl = FRONTEND_URLS[user.role] || FRONTEND_URLS.customer;
  const verifyUrl = `${baseUrl}/verify-email/${verifyToken}`;

  const message =
    `Welcome to LocalBites!\n\n` +
    `Please verify your email address by clicking the link below. This link expires in 24 hours.\n\n` +
    `${verifyUrl}\n\n` +
    `If you did not create this account, you can safely ignore this email.`;

  await sendEmail({
    to: user.email,
    subject: "LocalBites - Verify Your Email",
    text: message,
  });
};

/* @desc   Verify a user's email using the token from the verification email
@route  POST /.../verify-email/:token */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("This verification link is invalid or has expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully. You can now log in." });
});

/* @desc   Resend the verification email (in case the first one was missed/expired)
@route  POST /.../resend-verification */
export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  // Generic response either way - avoids revealing whether the email exists
  // or is already verified (same reasoning as the forgot-password flow)
  const genericResponse = {
    message: "If an account with that email exists and isn't verified yet, a new verification link has been sent.",
  };

  if (!user || user.isEmailVerified) {
    return res.status(200).json(genericResponse);
  }

  await sendVerificationEmail(user);
  res.status(200).json(genericResponse);
});