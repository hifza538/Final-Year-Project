import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { deleteFromCloudinary } from "../../config/cloudinary.js";

// generate token for user authentication
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// format user response to exclude sensitive information
const userResponse = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  shopName: user.shopName,
  shopAddress: user.shopAddress,
  city: user.city,
  zone: user.zone,
  openingTime: user.openingTime,
  closingTime: user.closingTime,
  serviceTypes: user.serviceTypes,
  isApproved: user.isApproved,
  isActive: user.isActive,
});

//register vendor
export const registerVendor = asyncHandler(async (req, res) => {
  const {
    // Owner info
    firstName,
    lastName,
    email,
    password,
    phone,

    // Basic details
    shopName,
    cuisine,
    city,
    zone,
    shopAddress,
    minPrepTime,
    maxPrepTime,
    coverPhoto,
    logo,
    coordinates,

    // Legal
    cnicNumber,
    ntnNumber,
    hasFoodLicense,
  } = req.body;

  // parse coordinates if provided
  let parsedCoordinates = { lat: null, lng: null };
  try {
    if (coordinates) parsedCoordinates = JSON.parse(coordinates);
  } catch (e) {
    parsedCoordinates = { lat: null, lng: null };
  }

  // Extract uploaded files from request
  const cnicFrontFile = req.files?.cnicFront?.[0];
  const cnicBackFile = req.files?.cnicBack?.[0];

  // Cleanup function to delete uploaded images from Cloudinary in case of validation failure
  const cleanupImages = async () => {
    if (cnicFrontFile?.filename)
      await deleteFromCloudinary(cnicFrontFile.filename);
    if (cnicBackFile?.filename)
      await deleteFromCloudinary(cnicBackFile.filename);
  };
  const fail = async (message) => {
    await cleanupImages();
    res.status(400);
    throw new Error(message);
  };

  // Validation regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+92|0)?3\d{9}$/;
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
  const nameRegex = /^[a-zA-Z\s]+$/;

  // ── required fields validation
  if (!firstName?.trim()) await fail("First name is required");
  if (!lastName?.trim()) await fail("Last name is required");
  if (!email?.trim()) await fail("Email is required");
  if (!password) await fail("Password is required");
  if (!phone?.trim()) await fail("Phone number is required");
  if (!shopName?.trim()) await fail("Shop name is required");
  if (!cuisine?.trim()) await fail("Cuisine type is required");
  if (!city?.trim()) await fail("City is required");
  if (!zone?.trim()) await fail("Zone is required");
  if (!shopAddress?.trim()) await fail("Shop address is required");
  if (!cnicNumber?.trim()) await fail("CNIC number is required");
  if (!cnicFrontFile) await fail("CNIC front image is required");
  if (!cnicBackFile) await fail("CNIC back image is required");

  // Format Validation
  if (firstName.trim().length < 2 || firstName.trim().length > 50)
    await fail("First name must be between 2 and 50 characters");
  if (!nameRegex.test(firstName.trim()))
    await fail("First name can only contain letters and spaces");

  if (lastName.trim().length < 2 || lastName.trim().length > 50)
    await fail("Last name must be between 2 and 50 characters");
  if (!nameRegex.test(lastName.trim()))
    await fail("Last name can only contain letters and spaces");

  if (!emailRegex.test(email.trim()))
    await fail("Please enter a valid email address");
  if (!phoneRegex.test(phone.trim()))
    await fail("Please enter a valid Pakistani phone number e.g. 03001234567");
  if (password.length < 6 || password.length > 50)
    await fail("Password must be between 6 and 50 characters");
  if (shopName.trim().length < 3 || shopName.trim().length > 100)
    await fail("Shop name must be between 3 and 100 characters");
  if (shopAddress.trim().length < 10)
    await fail("Please provide a complete address (minimum 10 characters)");
  if (!cnicRegex.test(cnicNumber.trim()))
    await fail("CNIC must be in format: XXXXX-XXXXXXX-X");

  // time validation for minPrepTime and maxPrepTime
  if (
    minPrepTime !== undefined &&
    minPrepTime !== "" &&
    (Number(minPrepTime) < 5 || Number(minPrepTime) > 120)
  ) {
    await fail("Minimum prep time must be between 5 and 120 minutes");
  }
  if (
    maxPrepTime !== undefined &&
    maxPrepTime !== "" &&
    Number(maxPrepTime) < Number(minPrepTime || 15)
  ) {
    await fail("Maximum prep time must be greater than minimum prep time");
  }

  // check if the email is already registered
  const existingUser = await User.findOne({
    $or: [
      { email: email.trim().toLowerCase() },
      { phone: phone.trim() },
      { cnicNumber: cnicNumber.trim() },
    ],
  });
  if (existingUser) {
    if (existingUser.email === email.trim().toLowerCase())
      await fail("Email is already registered");
    if (existingUser.phone === phone.trim())
      await fail("This phone number is already registered");
    if (existingUser.cnicNumber === cnicNumber.trim())
      await fail("This CNIC is already registered");
  }

  // create a new vendor user
  let vendor;
  try {
    vendor = await User.create({
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      role: "vendor",
      shopName: shopName.trim(),
      cuisine: cuisine.trim(),
      city: city.trim(),
      zone: zone.trim(),
      shopAddress: shopAddress.trim(),
      minPrepTime: minPrepTime || 15,
      maxPrepTime: maxPrepTime || 45,
      coverPhoto: coverPhoto || "",
      logo: logo || "",
      coordinates: {
        lat: parsedCoordinates.lat,
        lng: parsedCoordinates.lng,
      },
      cnicNumber: cnicNumber.trim(),
      ntnNumber: ntnNumber || "",
      hasFoodLicense: hasFoodLicense === "true" || hasFoodLicense === true,
      cnicFront: { url: cnicFrontFile.path, publicId: cnicFrontFile.filename },
      cnicBack: { url: cnicBackFile.path, publicId: cnicBackFile.filename },
      isApproved: false,
    });
  } catch (err) {
    // Cleanup uploaded images if there's an error during user creation
    await cleanupImages();
    if (err.code === 11000) {
      res.status(400);
      throw new Error("Email, phone, or CNIC is already registered");
    }
    throw err;
  }

  res.status(201).json({
    message: "Registration submitted! Please wait for admin approval.",
    user: userResponse(vendor),
    token: generateToken(vendor._id),
  });
});

// login vendor or admin
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // fields check
  if (!email?.trim()) {
    res.status(400);
    throw new Error("Email is required");
  }
  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  // email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400);
    throw new Error("Please enter a valid email address");
  }

  // find user - include password for comparison
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  // user not found
  // same error message for both email and password to prevent user enumeration
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Password Check 
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // vendor approval check
  if (user.role === "vendor" && !user.isApproved) {
    res.status(403);
    throw new Error(
      "Your restaurant is pending admin approval. Please wait."
    );
  }

  // account must be active
  if (!user.isActive) {
    res.status(403);
    throw new Error(
      "Your account has been deactivated. Please contact support."
    );
  }

  // vendor and admin access check 
  if (user.role !== "vendor" && user.role !== "admin") {
    res.status(403);
    throw new Error(
      "This panel is for vendors only. Please use the customer app."
    );
  }

  res.status(200).json({
    user:  userResponse(user),
    token: generateToken(user._id),
  });
});

// get logged-in user details
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ user: userResponse(user) });
});
