// customer-frontend/src/utils/validationSchemas.js

import { z } from "zod";

// Reusable regex for Pakistani phone numbers
const phoneRegex = /^(\+92|0)?3\d{9}$/;
const phoneRegexCheckout = /^(\+92|0)?3\d{9}$/;

// Schema for the login form
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Schema for the signup form
export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must not exceed 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Enter a valid Pakistani number e.g. 03001234567"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

export const profileUpdateSchema =
  z.object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name must not exceed 100 characters"),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(phoneRegex, "Enter a valid Pakistani number"),
  });

export const checkoutSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name must not exceed 100 characters"),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(
        phoneRegexCheckout,
        "Enter a valid Pakistani number",
      ),
    address: z
      .string()
      .trim()
      .min(10, "Please provide a complete address (minimum 10 characters)"),
    city: z
      .string().trim().min(1, "City is required"),
    notes: z
      .string()
      .trim()
      .max(200, "Notes must not exceed 200 characters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for adding or updating a delivery address
export const addressSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(30, "Label must not exceed 30 characters"),
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters").max(100, "Full name must not exceed 100 characters"),
  phone: z.string().trim().min(1, "Phone number is required").regex(phoneRegex, "Enter a valid Pakistani number"),
  address: z.string().trim().min(10, "Please provide a complete address"),
  city: z.string().trim().min(1, "City is required"),
  notes: z.string().trim().max(200, "Notes must not exceed 200 characters").optional(),
});