import { z } from "zod";

const phoneRegex = /^(\+92|0)?3\d{9}$/;
const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters").max(100, "Full name must not exceed 100 characters"),
    email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
    phone: z.string().trim().min(1, "Phone number is required").regex(phoneRegex, "Enter a valid Pakistani number e.g. 03001234567"),
    cnicNumber: z.string().trim().min(1, "CNIC number is required").regex(cnicRegex, "Format: XXXXX-XXXXXXX-X"),
    vehicleType: z.string().min(1, "Please select a vehicle type"),
    vehicleNumber: z.string().trim().min(1, "Vehicle number is required"),
    password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password must not exceed 50 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// profile update 
export const profileUpdateSchema = z.object({
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
  vehicleType: z.string().min(1, "Please select a vehicle type"),
  vehicleNumber: z.string().trim().min(1, "Vehicle number is required"),
});
  export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters").max(15, "Password must not exceed 15 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
