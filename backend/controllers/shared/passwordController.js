// backend/controllers/shared/passwordController.js

import crypto from "crypto";
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import sendEmail from "../../utils/sendEmail.js";

const FRONTEND_URLS = {
  customer: process.env.CUSTOMER_FRONTEND_URL,
  vendor: process.env.VENDOR_FRONTEND_URL,
  delivery: process.env.DELIVERY_FRONTEND_URL,
};

/* @desc   Request a password reset email
   @route  POST /.../forgot-password */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  // generic response to avoid revealing whether the email exists in the system
  const genericResponse = {
    message: "If an account with that email exists, a password reset link has been sent.",
  };

  if (!user) {
    return res.status(200).json(genericResponse);
  }

  // Generate a reset token and save its hashed version in the database
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save();

  const baseUrl = FRONTEND_URLS[user.role] || FRONTEND_URLS.customer;
  const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

  const message =
    `You requested a password reset for your LocalBites account.\n\n` +
    `Click the link below to set a new password. This link expires in 30 minutes.\n\n` +
    `${resetUrl}\n\n` +
    `If you did not request this, you can safely ignore this email.`;

  try {
    await sendEmail({
      to: user.email,
      subject: "LocalBites - Password Reset Request",
      text: message,
    });
    res.status(200).json(genericResponse);
  } catch (err) {
    // reset the token and expiration if email sending fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error("Email could not be sent. Please try again later.");
  }
});

/*@desc   Reset password using the token from the email
@route  POST /.../reset-password/:token*/
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    res.status(400);
    throw new Error("This reset link is invalid or has expired");
  }

  // Update the user's password and clear the reset token and expiration
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful. You can now log in." });
});