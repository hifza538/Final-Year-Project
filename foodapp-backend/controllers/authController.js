// controllers/authController.js
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

/* ===REGISTER USER == */
// Register a new user account

 export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user already exists
    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const user = await userModel.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: role || "customer",
    });

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

/* == LOGIN USER== */
// Login user with email and password

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Return token + user data
    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

/* ===GET PROFILE === */
// Get currently logged in user's profile

export const getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

/* == FORGOT PASSWORD=== */
// Generate OTP and send it to user email

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email });

    // Security reason se generic message bhi de sakte ho
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB with expiry (10 min)
    user.otp = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    };

    await user.save();

    // Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset OTP - LocalBites",
      text: `Your OTP is ${otpCode}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>LocalBites Password Reset</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: orange;">${otpCode}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({
      message: "OTP sent to your email successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
/*Verify Otp */

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user || !user.otp || !user.otp.code) {
      return res.status(400).json({ message: "Invalid OTP request" });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(user.otp.expiresAt) < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Mark OTP verified
    user.otp.verified = true;
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/* ==== reset password=== */
// Reset password after OTP verification

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate inputs
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    // Find user
    const user = await userModel.findOne({ email });

if (!user || !user.otp || !user.otp.code) {
      return res.status(400).json({ message: "Invalid reset request" });
    }

    // Check OTP
    if (user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    // Check verified
    if (!user.otp.verified) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }
        // Check expiry
    if (new Date(user.otp.expiresAt) < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    // Clear OTP after reset
    user.otp = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({
      message: "Password reset failed",
      error: error.message,
    });
  }
};
