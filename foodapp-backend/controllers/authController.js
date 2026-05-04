// controllers/authController.js
import userModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

/* ===== REGISTER USER ===== */
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    // ✅ Validate
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // ✅ User exists check
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ✅ User create - password model mein auto hash hoga (pre-save hook)
    const user = await userModel.create({
      fullName,
      email,
      phone,
      password, // plain dalo - model khud hash karega
      role: role || "customer",
    });

    // ✅ Token generate
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

/* ===== LOGIN USER ===== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // ✅ Password select karo (model mein select: false hai)
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Model method use karo password compare ke liye
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Token - sirf ek baar
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

/* ===== GET PROFILE ===== */
export const getProfile = async (req, res) => {
  try {
    // req.user middleware se aata hai
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/* ===== UPDATE PROFILE ===== */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    // ✅ Sirf allowed fields update hongi
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { fullName, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};

/* ===== CHANGE PASSWORD ===== */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    // ✅ Password with select
    const user = await userModel.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    user.password = newPassword; // pre-save hook hash karega
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Password change failed",
    });
  }
};

/* ===== FORGOT PASSWORD - OTP Send ===== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });

    // ✅ Security - same message chahe user mile ya na mile
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If this email exists, OTP has been sent",
      });
    }

    // ✅ 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ OTP save - properly model ke fields mein
    user.otp = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      verified: false,
    };

    await user.save({ validateBeforeSave: false });

    // ✅ Email bhejo
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP - LocalBites",
      html: getOtpEmailTemplate(user.fullName, otpCode),
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Check inbox & spam folder.",
    });
  } catch (error) {
    // ✅ Email fail hua to OTP clear karo
    if (error.message === "Failed to send email") {
      await userModel.findOneAndUpdate(
        { email: req.body.email },
        { otp: { code: null, expiresAt: null, verified: false } }
      );
    }

    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};

/* ===== VERIFY OTP ===== */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await userModel.findOne({ email });

    // ✅ Sab checks ek jagah
    if (!user || !user.otp?.code) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP request. Please request new OTP.",
      });
    }

    // ✅ Pehle expiry check karo
    if (new Date(user.otp.expiresAt) < new Date()) {
      user.otp = { code: null, expiresAt: null, verified: false };
      await user.save({ validateBeforeSave: false });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // ✅ Code match check
    if (user.otp.code !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check and try again.",
      });
    }

    // ✅ Mark verified
    user.otp.verified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

/* ===== RESET PASSWORD ===== */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // ✅ OTP verify ho chuka hai - sirf email aur new password chahiye
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user || !user.otp?.code) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. Please start over.",
      });
    }

    // ✅ OTP verified hai check karo
    if (!user.otp.verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP first",
      });
    }

    // ✅ Expiry check
    if (new Date(user.otp.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Session expired. Please request new OTP.",
      });
    }

    // ✅ New password set - pre-save hook hash karega
    user.password = newPassword;
    user.otp = { code: null, expiresAt: null, verified: false }; // clear OTP

    await user.save();

    // ✅ Confirmation email bhejo
    await sendEmail({
      to: user.email,
      subject: "Password Reset Successful - LocalBites",
      html: `
        <div style="font-family: Arial; max-width: 500px;">
          <h2 style="color: #D70F64;">Password Reset Successful ✅</h2>
          <p>Salam ${user.fullName},</p>
          <p>Tumhara password successfully reset ho gaya hai.</p>
          <p>Agar yeh tum nahi the, immediately humse contact karo.</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with new password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
};

/* ===== EMAIL TEMPLATE HELPER ===== */
const getOtpEmailTemplate = (name, otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; 
    margin: 0 auto; border: 1px solid #eee; border-radius: 10px; 
    overflow: hidden;">
    
    <div style="background: #D70F64; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">🍔 LocalBites</h1>
    </div>
    
    <div style="padding: 30px;">
      <p style="font-size: 16px;">Salam <strong>${name}</strong>,</p>
      <p>Tumhara password reset OTP hai:</p>
      
      <div style="background: #f5f5f5; border-radius: 8px; 
        padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #D70F64; font-size: 40px; 
          letter-spacing: 10px; margin: 0;">
          ${otp}
        </h1>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        ⏰ Ye OTP <strong>10 minutes</strong> mein expire ho jayega.
      </p>
      <p style="color: #666; font-size: 14px;">
        🔒 Agar tumne request nahi ki, is email ko ignore karo.
      </p>
    </div>
  </div>
`;